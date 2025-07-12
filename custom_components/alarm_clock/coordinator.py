"""Data coordinator for Alarm Clock integration."""
import asyncio
import logging
from datetime import datetime, timedelta, time
from typing import Any, Dict, Optional

from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.update_coordinator import DataUpdateCoordinator, UpdateFailed
from homeassistant.helpers.event import async_track_point_in_time
from homeassistant.util import dt as dt_util

from .const import (
    DOMAIN,
    ALARM_STATE_OFF,
    ALARM_STATE_ARMED,
    ALARM_STATE_RINGING,
    ALARM_STATE_SNOOZED,
    DAYS_OF_WEEK,
    CONF_PRE_ALARM_ENABLED,
    CONF_PRE_ALARM_SCRIPT,
    CONF_PRE_ALARM_MINUTES,
    CONF_ALARM_SCRIPT,
    CONF_POST_ALARM_ENABLED,
    CONF_POST_ALARM_SCRIPT,
    CONF_POST_ALARM_MINUTES,
    CONF_SNOOZE_DURATION,
    CONF_MAX_SNOOZES,
    CONF_AUTO_DISMISS_MINUTES,
    CONF_DEFAULT_ENABLED_DAYS,
    CONF_MEDIA_PLAYER_ENTITY,
    CONF_ALARM_SOUND,
    CONF_CUSTOM_SOUND_URL,
    CONF_ALARM_VOLUME,
    CONF_REPEAT_SOUND,
    BUILTIN_ALARM_SOUNDS,
)

_LOGGER = logging.getLogger(__name__)


class AlarmClockCoordinator(DataUpdateCoordinator):
    """Coordinator for alarm clock data."""

    def __init__(
        self,
        hass: HomeAssistant,
        config: Dict[str, Any],
        entry_id: str,
        device_id: str,
    ):
        """Initialize the coordinator."""
        super().__init__(
            hass,
            _LOGGER,
            name=DOMAIN,
            update_interval=timedelta(seconds=1),
        )
        
        self.config = config
        self.entry_id = entry_id
        self.device_id = device_id
        
        # Initialize state from config or defaults
        saved_alarm_time = config.get("saved_alarm_time")
        saved_alarm_enabled = config.get("saved_alarm_enabled", False)
        saved_enabled_days = config.get("saved_enabled_days")
        
        _LOGGER.info("Initializing coordinator - saved_alarm_time: %s, saved_alarm_enabled: %s, saved_enabled_days: %s", 
                    saved_alarm_time, saved_alarm_enabled, saved_enabled_days)
        
        # Set up alarm time
        if saved_alarm_time:
            try:
                self._alarm_time = time.fromisoformat(saved_alarm_time)
                _LOGGER.info("Restored alarm time from saved state: %s", self._alarm_time)
            except ValueError:
                self._alarm_time = None
                _LOGGER.warning("Invalid saved alarm time format: %s", saved_alarm_time)
        else:
            initial_time = config.get("alarm_time", "07:00")
            try:
                self._alarm_time = time.fromisoformat(initial_time)
                _LOGGER.info("Using initial alarm time: %s", self._alarm_time)
            except ValueError:
                self._alarm_time = time(7, 0)
                _LOGGER.info("Using default alarm time: %s", self._alarm_time)
        
        # Initialize other state
        self._state = ALARM_STATE_OFF
        self._next_alarm = None
        self._enabled_days = set(saved_enabled_days if saved_enabled_days else config.get(CONF_DEFAULT_ENABLED_DAYS, DAYS_OF_WEEK[:5]))
        self._alarm_enabled = saved_alarm_enabled
        self._snooze_count = 0
        self._snooze_until = None
        
        # Timers
        self._pre_alarm_timer = None
        self._alarm_timer = None
        self._post_alarm_timer = None
        self._snooze_timer = None
        self._auto_dismiss_timer = None
        
        # Script execution tracking
        self._pre_alarm_executed = False
        self._alarm_executed = False
        self._post_alarm_executed = False
        
        # Flag to prevent saving state during initial startup
        self._initial_startup = True
        
        _LOGGER.info("Coordinator initialized - time: %s, enabled: %s, days: %s", 
                    self._alarm_time, self._alarm_enabled, self._enabled_days)

    @property
    def unique_id(self) -> str:
        """Return the unique ID."""
        return self.entry_id

    @property
    def device_info(self) -> Dict[str, Any]:
        """Return device information."""
        return {
            "identifiers": {(DOMAIN, self.entry_id)},
            "name": self.config.get("name", "Alarm Clock"),
            "manufacturer": "Alarm Clock Integration",
            "model": "Alarm Clock",
            "sw_version": "2.4.1",
        }

    async def _async_update_data(self):
        """Update data."""
        await self._async_update_alarm_state()
        
        # Return the current state data
        return {
            "alarm_time": self._alarm_time,
            "enabled_days": self._enabled_days.copy(),
            "alarm_enabled": self._alarm_enabled,
            "state": self._state,
            "next_alarm": self._next_alarm,
            "snooze_count": self._snooze_count,
            "snooze_until": self._snooze_until,
            "config": self.config,
        }

    async def async_setup(self):
        """Set up the coordinator."""
        # Start the main update loop
        await self.async_refresh()
        
        # Mark initial startup as complete after first update
        self._initial_startup = False
        _LOGGER.info("Coordinator setup complete - state saving now enabled")

    async def async_shutdown(self):
        """Shut down the coordinator."""
        # Cancel all timers
        self._cancel_all_timers()

    def _cancel_all_timers(self):
        """Cancel all active timers."""
        if self._pre_alarm_timer:
            self._pre_alarm_timer()
            self._pre_alarm_timer = None
        if self._alarm_timer:
            self._alarm_timer()
            self._alarm_timer = None
        if self._post_alarm_timer:
            self._post_alarm_timer()
            self._post_alarm_timer = None
        if self._snooze_timer:
            self._snooze_timer()
            self._snooze_timer = None
        if self._auto_dismiss_timer:
            self._auto_dismiss_timer()
            self._auto_dismiss_timer = None
        if hasattr(self, '_sound_repetition_timer') and self._sound_repetition_timer:
            self._sound_repetition_timer()
            self._sound_repetition_timer = None

    async def _async_update_alarm_state(self):
        """Update the alarm state and schedule actions."""
        if not self._alarm_enabled or not self._alarm_time:
            if self._state != ALARM_STATE_OFF:
                self._state = ALARM_STATE_OFF
                self._cancel_all_timers()
            return

        now = dt_util.now()
        
        # Handle snooze state
        if self._state == ALARM_STATE_SNOOZED:
            if self._snooze_until and now >= self._snooze_until:
                # Snooze period ended, trigger alarm again
                _LOGGER.info("Snooze period ended - alarm ringing again (snooze count: %d)", self._snooze_count)
                await self._async_trigger_alarm()
            return

        # Handle ringing state
        if self._state == ALARM_STATE_RINGING:
            return  # Stay in ringing state until dismissed or snoozed

        # Calculate next alarm time
        next_alarm = self._calculate_next_alarm()
        old_next_alarm = self._next_alarm
        self._next_alarm = next_alarm
        
        # Update state based on whether we have a valid next alarm
        new_state = ALARM_STATE_ARMED if next_alarm else ALARM_STATE_OFF
        
        # Reset execution flags when we get a new alarm time
        if next_alarm != old_next_alarm:
            self._reset_execution_flags()
            _LOGGER.info("New alarm scheduled for: %s", next_alarm.strftime("%Y-%m-%d %H:%M:%S") if next_alarm else "None")
        
        # Update state
        if self._state != new_state:
            self._state = new_state
            _LOGGER.info("Coordinator state updated from %s to %s", self._state, new_state)

        if not next_alarm:
            return

        # Schedule pre-alarm if enabled
        if (self.config.get(CONF_PRE_ALARM_ENABLED, False) and 
            self.config.get(CONF_PRE_ALARM_SCRIPT)):
            pre_alarm_time = next_alarm - timedelta(
                minutes=self.config.get(CONF_PRE_ALARM_MINUTES, 15)
            )
            if now < pre_alarm_time and not self._pre_alarm_executed:
                self._pre_alarm_timer = async_track_point_in_time(
                    self.hass, self._async_execute_pre_alarm, pre_alarm_time
                )
                _LOGGER.debug("Pre-alarm scheduled for: %s", pre_alarm_time.strftime("%Y-%m-%d %H:%M:%S"))

        # Schedule main alarm
        if now < next_alarm and not self._alarm_executed:
            self._alarm_timer = async_track_point_in_time(
                self.hass, self._async_trigger_alarm, next_alarm
            )
            _LOGGER.debug("Main alarm scheduled for: %s", next_alarm.strftime("%Y-%m-%d %H:%M:%S"))

    def _calculate_next_alarm(self) -> Optional[datetime]:
        """Calculate the next alarm time."""
        if not self._alarm_time or not self._enabled_days:
            return None

        now = dt_util.now()
        today = now.date()
        
        # Try today first
        today_alarm = datetime.combine(today, self._alarm_time)
        today_alarm = dt_util.as_local(today_alarm)
        
        if (today.strftime("%A").lower() in self._enabled_days and 
            today_alarm > now):
            return today_alarm

        # Try next 7 days
        for i in range(1, 8):
            check_date = today + timedelta(days=i)
            if check_date.strftime("%A").lower() in self._enabled_days:
                alarm_time = datetime.combine(check_date, self._alarm_time)
                return dt_util.as_local(alarm_time)

        return None

    async def _async_execute_pre_alarm(self, now):
        """Execute pre-alarm script."""
        if self._pre_alarm_executed:
            return
            
        script_entity = self.config.get(CONF_PRE_ALARM_SCRIPT)
        if script_entity:
            try:
                await self.hass.services.async_call(
                    "script", "turn_on", {"entity_id": script_entity}
                )
                self._pre_alarm_executed = True
                _LOGGER.info("Pre-alarm script executed: %s", script_entity)
                
                # Fire event for logbook
                self.hass.bus.async_fire(
                    "alarm_clock_pre_alarm",
                    {
                        "device_id": self.device_id,
                        "name": self.config.get("name", "Alarm Clock"),
                        "script": script_entity,
                        "minutes_before": self.config.get(CONF_PRE_ALARM_MINUTES, 15),
                    }
                )
            except Exception as e:
                _LOGGER.error("Error executing pre-alarm script: %s", e)

    async def _async_trigger_alarm(self, now=None):
        """Trigger the alarm and enter ringing state."""
        self._state = ALARM_STATE_RINGING
        self._alarm_executed = True
        
        # Reset snooze info only if this is the initial trigger
        if self._snooze_count == 0:
            self._snooze_until = None
        
        _LOGGER.info("Alarm triggered - entering ringing state")
        
        # Fire event for logbook
        self.hass.bus.async_fire(
            "alarm_clock_triggered",
            {
                "device_id": self.device_id,
                "name": self.config.get("name", "Alarm Clock"),
                "alarm_time": self._alarm_time.strftime("%H:%M") if self._alarm_time else None,
                "snooze_count": self._snooze_count,
            }
        )
        
        # Execute alarm script (sound/notification)
        script_entity = self.config.get(CONF_ALARM_SCRIPT)
        if script_entity:
            try:
                await self.hass.services.async_call(
                    "script", "turn_on", {"entity_id": script_entity}
                )
                _LOGGER.info("Alarm script executed: %s", script_entity)
            except Exception as e:
                _LOGGER.error("Error executing alarm script: %s", e)
        
        # Play alarm sound if media player is configured
        await self._async_play_alarm_sound()

        # Schedule post-alarm timer (if enabled)
        if (self.config.get(CONF_POST_ALARM_ENABLED, False) and 
            self.config.get(CONF_POST_ALARM_SCRIPT) and
            not self._post_alarm_executed):
            post_alarm_time = dt_util.now() + timedelta(
                minutes=self.config.get(CONF_POST_ALARM_MINUTES, 30)
            )
            self._post_alarm_timer = async_track_point_in_time(
                self.hass, self._async_execute_post_alarm, post_alarm_time
            )
            _LOGGER.info("Post-alarm scheduled for %s", post_alarm_time.strftime("%H:%M:%S"))

        # Schedule auto-dismiss timer
        auto_dismiss_minutes = self.config.get(CONF_AUTO_DISMISS_MINUTES, 30)
        auto_dismiss_time = dt_util.now() + timedelta(minutes=auto_dismiss_minutes)
        self._auto_dismiss_timer = async_track_point_in_time(
            self.hass, self._async_auto_dismiss, auto_dismiss_time
        )
        _LOGGER.info("Auto-dismiss scheduled for %s (after %d minutes)", 
                    auto_dismiss_time.strftime("%H:%M:%S"), auto_dismiss_minutes)

        # Update coordinator data
        await self.async_request_refresh()

    async def _async_execute_post_alarm(self, now):
        """Execute post-alarm script."""
        if self._post_alarm_executed:
            return
            
        script_entity = self.config.get(CONF_POST_ALARM_SCRIPT)
        if script_entity:
            try:
                await self.hass.services.async_call(
                    "script", "turn_on", {"entity_id": script_entity}
                )
                self._post_alarm_executed = True
                _LOGGER.info("Post-alarm script executed: %s", script_entity)
                
                # Fire event for logbook
                self.hass.bus.async_fire(
                    "alarm_clock_post_alarm",
                    {
                        "device_id": self.device_id,
                        "name": self.config.get("name", "Alarm Clock"),
                        "script": script_entity,
                        "minutes_after": self.config.get(CONF_POST_ALARM_MINUTES, 30),
                    }
                )
            except Exception as e:
                _LOGGER.error("Error executing post-alarm script: %s", e)

    async def async_set_alarm_time(self, time_str: str):
        """Set the alarm time."""
        try:
            self._alarm_time = time.fromisoformat(time_str)
            self._reset_execution_flags()
            await self._save_state()
            await self.async_request_refresh()
        except ValueError as e:
            _LOGGER.error("Invalid time format: %s", e)

    async def async_set_alarm_enabled(self, enabled: bool):
        """Enable or disable the alarm."""
        self._alarm_enabled = enabled
        if not enabled:
            self._state = ALARM_STATE_OFF
            self._cancel_all_timers()
            self._reset_execution_flags()
        await self._save_state()
        await self.async_request_refresh()

    async def async_toggle_day(self, day: str):
        """Toggle a day of the week."""
        if day in DAYS_OF_WEEK:
            if day in self._enabled_days:
                self._enabled_days.remove(day)
            else:
                self._enabled_days.add(day)
            await self._save_state()
            await self.async_request_refresh()

    async def async_set_media_player_entity(self, entity_id: str):
        """Set the media player entity."""
        await self._update_config({CONF_MEDIA_PLAYER_ENTITY: entity_id})

    async def async_set_alarm_sound(self, sound_key: str):
        """Set the alarm sound."""
        await self._update_config({CONF_ALARM_SOUND: sound_key})

    async def async_set_custom_sound_url(self, url: str):
        """Set the custom sound URL."""
        await self._update_config({CONF_CUSTOM_SOUND_URL: url})

    async def async_set_alarm_volume(self, volume: int):
        """Set the alarm volume."""
        await self._update_config({CONF_ALARM_VOLUME: volume})

    async def async_set_repeat_sound(self, repeat: bool):
        """Set the repeat sound setting."""
        await self._update_config({CONF_REPEAT_SOUND: repeat})

    async def async_test_sound(self):
        """Test the alarm sound on the configured media player."""
        _LOGGER.info("Testing alarm sound")
        
        # Fire event for logbook
        self.hass.bus.async_fire(
            "alarm_clock_test_sound",
            {
                "device_id": self.device_id,
                "name": self.config.get("name", "Alarm Clock"),
            }
        )
        
        # Play the sound once to test
        await self._async_play_test_sound()
        
        # Refresh coordinator data
        await self.async_request_refresh()

    async def _update_config(self, updates: dict):
        """Update configuration and save to config entry."""
        try:
            # Get the config entry
            config_entry = None
            for entry in self.hass.config_entries.async_entries(DOMAIN):
                if entry.entry_id == self.entry_id:
                    config_entry = entry
                    break
            
            if config_entry:
                # Update config data
                fresh_data = config_entry.data.copy()
                fresh_data.update(updates)
                
                # Update the config entry
                self.hass.config_entries.async_update_entry(
                    config_entry,
                    data=fresh_data
                )
                
                # Update local config reference
                self.config = fresh_data
                
                _LOGGER.info("Successfully updated config: %s", updates)
                
                # Refresh coordinator to propagate changes
                await self.async_request_refresh()
                
        except Exception as e:
            _LOGGER.error("Error updating config: %s", e)

    async def async_snooze(self):
        """Snooze the alarm."""
        if self._state != ALARM_STATE_RINGING:
            return

        max_snoozes = self.config.get(CONF_MAX_SNOOZES, 3)
        if self._snooze_count >= max_snoozes:
            _LOGGER.warning("Maximum snoozes reached")
            return

        snooze_duration = self.config.get(CONF_SNOOZE_DURATION, 9)
        self._snooze_count += 1
        self._snooze_until = dt_util.now() + timedelta(minutes=snooze_duration)
        self._state = ALARM_STATE_SNOOZED

        # Stop alarm sound
        await self._async_stop_alarm_sound()

        # Fire event for logbook
        self.hass.bus.async_fire(
            "alarm_clock_snoozed",
            {
                "device_id": self.device_id,
                "name": self.config.get("name", "Alarm Clock"),
                "snooze_count": self._snooze_count,
                "snooze_duration": snooze_duration,
                "max_snoozes": max_snoozes,
            }
        )

        # Schedule next alarm trigger
        self._snooze_timer = async_track_point_in_time(
            self.hass, self._async_trigger_alarm, self._snooze_until
        )

        _LOGGER.info("Alarm snoozed for %d minutes (count: %d) - will ring again at %s", 
                    snooze_duration, self._snooze_count, self._snooze_until.strftime("%H:%M:%S"))
        
        await self.async_request_refresh()

    async def async_dismiss(self):
        """Dismiss the alarm."""
        if self._state in [ALARM_STATE_RINGING, ALARM_STATE_SNOOZED]:
            # Fire event for logbook
            self.hass.bus.async_fire(
                "alarm_clock_dismissed",
                {
                    "device_id": self.device_id,
                    "name": self.config.get("name", "Alarm Clock"),
                    "snooze_count": self._snooze_count if self._snooze_count > 0 else None,
                }
            )
            
            # Stop alarm sound
            await self._async_stop_alarm_sound()
            
            # Stop current alarm
            self._state = ALARM_STATE_OFF
            self._cancel_all_timers()
            self._reset_execution_flags()
            self._snooze_count = 0
            self._snooze_until = None
            _LOGGER.info("Alarm dismissed manually")
            
            # Refresh coordinator data
            await self.async_request_refresh()

    async def _async_auto_dismiss(self, now):
        """Auto-dismiss the alarm after timeout."""
        if self._state == ALARM_STATE_RINGING:
            # Fire event for logbook
            self.hass.bus.async_fire(
                "alarm_clock_auto_dismissed",
                {
                    "device_id": self.device_id,
                    "name": self.config.get("name", "Alarm Clock"),
                    "auto_dismiss_minutes": self.config.get(CONF_AUTO_DISMISS_MINUTES, 30),
                    "snooze_count": self._snooze_count if self._snooze_count > 0 else None,
                }
            )
            
            # Stop alarm sound
            await self._async_stop_alarm_sound()
            
            # Stop current alarm
            self._state = ALARM_STATE_OFF
            
            # Cancel timers
            if self._snooze_timer:
                self._snooze_timer()
                self._snooze_timer = None
            if self._auto_dismiss_timer:
                self._auto_dismiss_timer()
                self._auto_dismiss_timer = None
                
            self._reset_execution_flags()
            self._snooze_count = 0
            self._snooze_until = None
            _LOGGER.info("Alarm auto-dismissed after %d minutes", 
                        self.config.get(CONF_AUTO_DISMISS_MINUTES, 30))
            
            # Refresh coordinator data
            await self.async_request_refresh()

    async def _save_state(self):
        """Save the current state to config entry."""
        if self._initial_startup:
            _LOGGER.info("Skipping state save during initial startup")
            return
            
        try:
            # Get the config entry
            config_entry = None
            for entry in self.hass.config_entries.async_entries(DOMAIN):
                if entry.entry_id == self.entry_id:
                    config_entry = entry
                    break
            
            if config_entry:
                # Update config data
                fresh_data = config_entry.data.copy()
                fresh_data.update({
                    "saved_alarm_time": self._alarm_time.strftime("%H:%M") if self._alarm_time else None,
                    "saved_alarm_enabled": self._alarm_enabled,
                    "saved_enabled_days": list(self._enabled_days),
                })
                
                # Update the config entry
                self.hass.config_entries.async_update_entry(
                    config_entry,
                    data=fresh_data
                )
                
                # Update local config reference
                self.config = fresh_data
                
                _LOGGER.info("Successfully saved alarm state: time=%s, enabled=%s, days=%s", 
                            self._alarm_time, self._alarm_enabled, self._enabled_days)
        except Exception as e:
            _LOGGER.error("Error saving alarm state: %s", e)

    def _reset_execution_flags(self):
        """Reset script execution flags."""
        self._pre_alarm_executed = False
        self._alarm_executed = False
        self._post_alarm_executed = False

    async def _async_play_alarm_sound(self):
        """Play alarm sound via media player."""
        media_player_entity = self.config.get(CONF_MEDIA_PLAYER_ENTITY)
        if not media_player_entity:
            _LOGGER.debug("No media player configured for alarm sound")
            return

        # Check if media player entity exists and is available
        if not self.hass.states.get(media_player_entity):
            _LOGGER.error("Media player entity not found: %s", media_player_entity)
            return

        # Get media player state
        media_player_state = self.hass.states.get(media_player_entity)
        _LOGGER.debug("Media player %s state: %s", media_player_entity, media_player_state.state)

        # Get sound URL and content type
        sound_url = self._get_alarm_sound_url()
        content_type = self._get_alarm_sound_content_type()
        
        if not sound_url:
            _LOGGER.warning("No alarm sound URL available")
            return

        try:
            # Set volume first if specified
            volume = self.config.get(CONF_ALARM_VOLUME)
            if volume is not None:
                volume_level = volume / 100.0  # Convert to 0-1 range
                _LOGGER.debug("Setting alarm volume to %d%% (%0.2f) for %s", volume, volume_level, media_player_entity)
                
                try:
                    await self.hass.services.async_call(
                        "media_player",
                        "volume_set",
                        {
                            "entity_id": media_player_entity,
                            "volume_level": volume_level,
                        },
                    )
                    _LOGGER.info("Successfully set alarm volume to %d%% for %s", volume, media_player_entity)
                except Exception as volume_error:
                    _LOGGER.warning("Failed to set volume for %s: %s", media_player_entity, volume_error)

            # Play the sound with proper content type
            _LOGGER.info("Attempting to play alarm sound: %s (type: %s) on %s", sound_url, content_type, media_player_entity)
            
            await self.hass.services.async_call(
                "media_player",
                "play_media",
                {
                    "entity_id": media_player_entity,
                    "media_content_id": sound_url,
                    "media_content_type": content_type,
                },
            )
            
            _LOGGER.info("Successfully triggered alarm sound playback on %s", media_player_entity)
            
            # Fire event for logbook
            self.hass.bus.async_fire(
                "alarm_clock_sound_started",
                {
                    "device_id": self.device_id,
                    "name": self.config.get("name", "Alarm Clock"),
                    "media_player": media_player_entity,
                    "sound_url": sound_url,
                    "content_type": content_type,
                    "volume": volume,
                }
            )

            # Set up sound repetition if enabled
            if self.config.get(CONF_REPEAT_SOUND, True):
                await self._async_setup_sound_repetition(media_player_entity, sound_url, content_type)

        except Exception as e:
            _LOGGER.error("Error playing alarm sound on %s: %s", media_player_entity, e)
            _LOGGER.error("Sound URL: %s, Content Type: %s", sound_url, content_type)
            
            # Fire error event
            self.hass.bus.async_fire(
                "alarm_clock_sound_error",
                {
                    "device_id": self.device_id,
                    "name": self.config.get("name", "Alarm Clock"),
                    "media_player": media_player_entity,
                    "sound_url": sound_url,
                    "error": str(e),
                }
            )

    async def _async_stop_alarm_sound(self):
        """Stop alarm sound via media player."""
        media_player_entity = self.config.get(CONF_MEDIA_PLAYER_ENTITY)
        if not media_player_entity:
            return

        try:
            await self.hass.services.async_call(
                "media_player",
                "media_stop",
                {"entity_id": media_player_entity},
            )
            _LOGGER.info("Stopped alarm sound on %s", media_player_entity)
            
            # Fire event for logbook
            self.hass.bus.async_fire(
                "alarm_clock_sound_stopped",
                {
                    "device_id": self.device_id,
                    "name": self.config.get("name", "Alarm Clock"),
                    "media_player": media_player_entity,
                }
            )

        except Exception as e:
            _LOGGER.error("Error stopping alarm sound on %s: %s", media_player_entity, e)

    def _get_alarm_sound_url(self) -> Optional[str]:
        """Get the alarm sound URL based on configuration."""
        alarm_sound = self.config.get(CONF_ALARM_SOUND)
        
        # If no alarm sound configured (e.g., alarm created before v2.4.0), use default
        if not alarm_sound:
            alarm_sound = "classic_beep"
            _LOGGER.info("No alarm sound configured, using default: classic_beep")

        # Check if it's a custom sound
        if alarm_sound == "custom":
            custom_url = self.config.get(CONF_CUSTOM_SOUND_URL)
            if not custom_url:
                _LOGGER.warning("Custom alarm sound selected but no URL provided, falling back to classic_beep")
                alarm_sound = "classic_beep"
            else:
                return custom_url

        # Check if it's a built-in sound
        if alarm_sound in BUILTIN_ALARM_SOUNDS:
            return BUILTIN_ALARM_SOUNDS[alarm_sound]["url"]

        # Fallback to default sound if unknown sound specified
        _LOGGER.warning("Unknown alarm sound '%s', falling back to classic_beep", alarm_sound)
        return BUILTIN_ALARM_SOUNDS.get("classic_beep", {}).get("url")

    def _get_alarm_sound_content_type(self) -> str:
        """Get the alarm sound content type based on configuration."""
        alarm_sound = self.config.get(CONF_ALARM_SOUND)
        if not alarm_sound:
            return "audio/wav"

        # Check if it's a custom sound
        if alarm_sound == "custom":
            custom_url = self.config.get(CONF_CUSTOM_SOUND_URL, "")
            if custom_url.lower().endswith('.mp3'):
                return "audio/mp3"
            elif custom_url.lower().endswith('.ogg'):
                return "audio/ogg"
            elif custom_url.lower().endswith('.flac'):
                return "audio/flac"
            elif custom_url.lower().endswith('.m4a'):
                return "audio/m4a"
            else:
                return "audio/wav"

        # Check if it's a built-in sound
        if alarm_sound in BUILTIN_ALARM_SOUNDS:
            return BUILTIN_ALARM_SOUNDS[alarm_sound].get("content_type", "audio/wav")

        # Fallback to default
        return "audio/wav"

    async def _async_setup_sound_repetition(self, media_player_entity: str, sound_url: str, content_type: str):
        """Set up sound repetition for the alarm."""
        if not self.config.get(CONF_REPEAT_SOUND, True):
            return

        # Store repetition info
        if not hasattr(self, '_sound_repetition_timer'):
            self._sound_repetition_timer = None

        # Cancel any existing repetition timer
        if self._sound_repetition_timer:
            self._sound_repetition_timer()
            self._sound_repetition_timer = None

        # Set up repeating timer - repeat every 10 seconds while alarm is ringing
        async def repeat_sound(now):
            if self._state == ALARM_STATE_RINGING:
                try:
                    _LOGGER.debug("Repeating alarm sound on %s", media_player_entity)
                    await self.hass.services.async_call(
                        "media_player",
                        "play_media",
                        {
                            "entity_id": media_player_entity,
                            "media_content_id": sound_url,
                            "media_content_type": content_type,
                        },
                    )
                    
                    # Schedule next repetition
                    if self._state == ALARM_STATE_RINGING:
                        next_repeat = dt_util.now() + timedelta(seconds=10)
                        self._sound_repetition_timer = async_track_point_in_time(
                            self.hass, repeat_sound, next_repeat
                        )
                        
                except Exception as e:
                    _LOGGER.error("Error repeating alarm sound: %s", e)

        # Schedule first repetition
        next_repeat = dt_util.now() + timedelta(seconds=10)
        self._sound_repetition_timer = async_track_point_in_time(
            self.hass, repeat_sound, next_repeat
        )
        
        _LOGGER.debug("Sound repetition scheduled for %s", media_player_entity)

    async def _async_play_test_sound(self):
        """Play test sound via media player (without repetition)."""
        media_player_entity = self.config.get(CONF_MEDIA_PLAYER_ENTITY)
        if not media_player_entity:
            _LOGGER.debug("No media player configured for test sound")
            return

        # Check if media player entity exists and is available
        if not self.hass.states.get(media_player_entity):
            _LOGGER.error("Media player entity not found: %s", media_player_entity)
            return

        # Get media player state
        media_player_state = self.hass.states.get(media_player_entity)
        _LOGGER.debug("Media player %s state: %s", media_player_entity, media_player_state.state)

        # Get sound URL and content type
        sound_url = self._get_alarm_sound_url()
        content_type = self._get_alarm_sound_content_type()
        
        if not sound_url:
            _LOGGER.warning("No alarm sound URL available for test")
            return

        try:
            # Set volume first if specified
            volume = self.config.get(CONF_ALARM_VOLUME)
            if volume is not None:
                volume_level = volume / 100.0  # Convert to 0-1 range
                _LOGGER.debug("Setting test volume to %d%% (%0.2f) for %s", volume, volume_level, media_player_entity)
                
                try:
                    await self.hass.services.async_call(
                        "media_player",
                        "volume_set",
                        {
                            "entity_id": media_player_entity,
                            "volume_level": volume_level,
                        },
                    )
                    _LOGGER.info("Successfully set test volume to %d%% for %s", volume, media_player_entity)
                except Exception as volume_error:
                    _LOGGER.warning("Failed to set volume for %s: %s", media_player_entity, volume_error)

            # Play the sound with proper content type
            _LOGGER.info("Attempting to play test sound: %s (type: %s) on %s", sound_url, content_type, media_player_entity)
            
            await self.hass.services.async_call(
                "media_player",
                "play_media",
                {
                    "entity_id": media_player_entity,
                    "media_content_id": sound_url,
                    "media_content_type": content_type,
                },
            )
            
            _LOGGER.info("Successfully triggered test sound playback on %s", media_player_entity)
            
            # Fire event for logbook
            self.hass.bus.async_fire(
                "alarm_clock_test_sound_started",
                {
                    "device_id": self.device_id,
                    "name": self.config.get("name", "Alarm Clock"),
                    "media_player": media_player_entity,
                    "sound_url": sound_url,
                    "content_type": content_type,
                    "volume": volume,
                }
            )

        except Exception as e:
            _LOGGER.error("Error playing test sound on %s: %s", media_player_entity, e)
            _LOGGER.error("Sound URL: %s, Content Type: %s", sound_url, content_type)
            
            # Fire error event
            self.hass.bus.async_fire(
                "alarm_clock_test_sound_error",
                {
                    "device_id": self.device_id,
                    "name": self.config.get("name", "Alarm Clock"),
                    "media_player": media_player_entity,
                    "sound_url": sound_url,
                    "error": str(e),
                }
            )

    # Accessor methods for entities
    def get_alarm_time(self) -> Optional[time]:
        """Get the current alarm time."""
        return self._alarm_time

    def get_enabled_days(self) -> set:
        """Get enabled days."""
        return self._enabled_days.copy()

    def get_alarm_enabled(self) -> bool:
        """Check if alarm is enabled."""
        return self._alarm_enabled

    def get_next_alarm(self) -> Optional[datetime]:
        """Get the next alarm time."""
        return self._next_alarm

    def get_state(self) -> str:
        """Get the current state."""
        return self._state

    def get_snooze_info(self) -> Dict[str, Any]:
        """Get snooze information."""
        return {
            "count": self._snooze_count,
            "until": self._snooze_until,
            "max": self.config.get(CONF_MAX_SNOOZES, 3),
            "duration": self.config.get(CONF_SNOOZE_DURATION, 9),
        }

    def get_state_attributes(self) -> Dict[str, Any]:
        """Get state attributes for the main entity."""
        return {
            "alarm_time": self._alarm_time.strftime("%H:%M") if self._alarm_time else None,
            "next_alarm": self._next_alarm.isoformat() if self._next_alarm else None,
            "enabled_days": list(self._enabled_days),
            "alarm_enabled": self._alarm_enabled,
            "snooze_count": self._snooze_count,
            "snooze_until": self._snooze_until.isoformat() if self._snooze_until else None,
            "pre_alarm_enabled": self.config.get(CONF_PRE_ALARM_ENABLED, False),
            "pre_alarm_script": self.config.get(CONF_PRE_ALARM_SCRIPT, ""),
            "pre_alarm_minutes": self.config.get(CONF_PRE_ALARM_MINUTES, 15),
            "alarm_script": self.config.get(CONF_ALARM_SCRIPT, ""),
            "post_alarm_enabled": self.config.get(CONF_POST_ALARM_ENABLED, False),
            "post_alarm_script": self.config.get(CONF_POST_ALARM_SCRIPT, ""),
            "post_alarm_minutes": self.config.get(CONF_POST_ALARM_MINUTES, 30),
            "snooze_duration": self.config.get(CONF_SNOOZE_DURATION, 9),
            "max_snoozes": self.config.get(CONF_MAX_SNOOZES, 3),
            "auto_dismiss_minutes": self.config.get(CONF_AUTO_DISMISS_MINUTES, 30),
            # Media player configuration
            "media_player_entity": self.config.get(CONF_MEDIA_PLAYER_ENTITY, ""),
            "alarm_sound": self.config.get(CONF_ALARM_SOUND, ""),
            "custom_sound_url": self.config.get(CONF_CUSTOM_SOUND_URL, ""),
            "alarm_volume": self.config.get(CONF_ALARM_VOLUME, 50),
            "repeat_sound": self.config.get(CONF_REPEAT_SOUND, True),
            "sound_url": self._get_alarm_sound_url(),
        }
