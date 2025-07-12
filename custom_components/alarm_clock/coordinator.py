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
            "sw_version": "2.2.0",
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

        # Get sound URL
        sound_url = self._get_alarm_sound_url()
        if not sound_url:
            _LOGGER.warning("No alarm sound URL available")
            return

        try:
            # Set volume first if specified
            volume = self.config.get(CONF_ALARM_VOLUME)
            if volume is not None:
                volume_level = volume / 100.0  # Convert to 0-1 range
                await self.hass.services.async_call(
                    "media_player",
                    "volume_set",
                    {
                        "entity_id": media_player_entity,
                        "volume_level": volume_level,
                    },
                )
                _LOGGER.debug("Set alarm volume to %d%% for %s", volume, media_player_entity)

            # Play the sound
            await self.hass.services.async_call(
                "media_player",
                "play_media",
                {
                    "entity_id": media_player_entity,
                    "media_content_id": sound_url,
                    "media_content_type": "audio/wav",
                },
            )
            
            _LOGGER.info("Playing alarm sound: %s on %s", sound_url, media_player_entity)
            
            # Fire event for logbook
            self.hass.bus.async_fire(
                "alarm_clock_sound_started",
                {
                    "device_id": self.device_id,
                    "name": self.config.get("name", "Alarm Clock"),
                    "media_player": media_player_entity,
                    "sound_url": sound_url,
                    "volume": volume,
                }
            )

        except Exception as e:
            _LOGGER.error("Error playing alarm sound on %s: %s", media_player_entity, e)

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
        if not alarm_sound:
            return None

        # Check if it's a custom sound
        if alarm_sound == "custom":
            return self.config.get(CONF_CUSTOM_SOUND_URL)

        # Check if it's a built-in sound
        if alarm_sound in BUILTIN_ALARM_SOUNDS:
            return BUILTIN_ALARM_SOUNDS[alarm_sound]["url"]

        # Fallback to default sound
        return BUILTIN_ALARM_SOUNDS.get("classic_beep", {}).get("url")

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
