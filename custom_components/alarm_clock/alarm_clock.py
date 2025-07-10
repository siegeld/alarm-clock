"""Main alarm clock entity for Home Assistant."""
import asyncio
import logging
from datetime import datetime, timedelta, time
from typing import Any, Dict, Optional

from homeassistant.core import HomeAssistant, callback
from homeassistant.components.sensor import SensorEntity
from homeassistant.helpers.event import async_track_point_in_time
from homeassistant.helpers import entity_registry as er
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
)

_LOGGER = logging.getLogger(__name__)


class AlarmClockEntity(SensorEntity):
    """Main alarm clock entity."""

    def __init__(self, hass: HomeAssistant, config: Dict[str, Any], entry_id: str):
        """Initialize the alarm clock."""
        _LOGGER.error("ALARM CLOCK ENTITY: Starting initialization with config: %s", config)
        
        self.hass = hass
        self.config = config
        self.entry_id = entry_id
        
        # Restore saved state or use defaults
        saved_alarm_time = config.get("saved_alarm_time")
        saved_alarm_enabled = config.get("saved_alarm_enabled", False)
        saved_enabled_days = config.get("saved_enabled_days")
        
        _LOGGER.info("Initializing alarm clock - saved_alarm_time: %s, saved_alarm_enabled: %s, saved_enabled_days: %s", 
                    saved_alarm_time, saved_alarm_enabled, saved_enabled_days)
        
        if saved_alarm_time:
            try:
                self._alarm_time = time.fromisoformat(saved_alarm_time)
                _LOGGER.info("Restored alarm time from saved state: %s", self._alarm_time)
            except ValueError:
                self._alarm_time = None
                _LOGGER.warning("Invalid saved alarm time format: %s", saved_alarm_time)
        else:
            # Load from initial config or default
            initial_time = config.get("alarm_time", "07:00")
            try:
                self._alarm_time = time.fromisoformat(initial_time)
                _LOGGER.info("Using initial alarm time: %s", self._alarm_time)
            except ValueError:
                self._alarm_time = time(7, 0)
                _LOGGER.info("Using default alarm time: %s", self._alarm_time)
        
        # Alarm state
        self._state = ALARM_STATE_OFF
        self._next_alarm = None
        self._enabled_days = set(saved_enabled_days if saved_enabled_days else config.get(CONF_DEFAULT_ENABLED_DAYS, DAYS_OF_WEEK[:5]))
        self._alarm_enabled = saved_alarm_enabled
        
        _LOGGER.info("Alarm clock initialized - time: %s, enabled: %s, days: %s", 
                    self._alarm_time, self._alarm_enabled, self._enabled_days)
        self._snooze_count = 0
        self._snooze_until = None
        
        # Timers
        self._pre_alarm_timer = None
        self._alarm_timer = None
        self._post_alarm_timer = None
        self._snooze_timer = None
        self._auto_dismiss_timer = None
        self._update_timer = None
        
        # Script execution tracking
        self._pre_alarm_executed = False
        self._alarm_executed = False
        self._post_alarm_executed = False
        
        # Flag to prevent saving state during initial startup
        self._initial_startup = True

    @property
    def name(self) -> str:
        """Return the name of the alarm clock."""
        return self.config.get("name", "Alarm Clock")

    @property
    def unique_id(self) -> str:
        """Return the unique ID."""
        return f"{DOMAIN}_{self.entry_id}"

    @property
    def native_value(self) -> str:
        """Return the current state."""
        return self._state

    @property
    def state(self) -> str:
        """Return the current state."""
        return self._state

    @property
    def extra_state_attributes(self) -> Dict[str, Any]:
        """Return the state attributes."""
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
        }

    @property
    def icon(self) -> str:
        """Return the icon to use in the frontend."""
        if self._state == ALARM_STATE_RINGING:
            return "mdi:alarm-bell"
        elif self._state == ALARM_STATE_SNOOZED:
            return "mdi:alarm-snooze"
        elif self._state == ALARM_STATE_ARMED:
            return "mdi:alarm"
        else:
            return "mdi:alarm-off"

    @property
    def device_info(self) -> Dict[str, Any]:
        """Return device information."""
        return {
            "identifiers": {(DOMAIN, self.entry_id)},
            "name": self.name,
            "manufacturer": "Alarm Clock Integration",
            "model": "Alarm Clock",
            "sw_version": "1.0.0",
        }

    async def async_added_to_hass(self):
        """Run when entity about to be added to hass."""
        # Store reference to this entity for service calls
        entry_data = self.hass.data[DOMAIN].get(self.entry_id)
        if entry_data:
            entry_data["entity"] = self
        
        # Start the main update loop
        await self._async_schedule_update()
        
        # Mark initial startup as complete after first update
        self._initial_startup = False
        _LOGGER.info("Initial startup complete - state saving now enabled")

    async def async_will_remove_from_hass(self):
        """Run when entity will be removed from hass."""
        # Cancel all timers
        self._cancel_all_timers()
        
        # Remove reference
        if "entity" in self.hass.data[DOMAIN]:
            del self.hass.data[DOMAIN]["entity"]

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
        if self._update_timer:
            self._update_timer()
            self._update_timer = None

    async def _async_schedule_update(self, now=None):
        """Schedule the next update check."""
        await self._async_update_alarm_state()
        
        # Schedule next update in 30 seconds
        next_update = dt_util.utcnow() + timedelta(seconds=30)
        self._update_timer = async_track_point_in_time(
            self.hass, self._async_schedule_update, next_update
        )

    async def _async_update_alarm_state(self):
        """Update the alarm state and schedule actions."""
        if not self._alarm_enabled or not self._alarm_time:
            if self._state != ALARM_STATE_OFF:
                self._state = ALARM_STATE_OFF
                self._cancel_all_timers()
                self.async_write_ha_state()
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
        
        # Always update state and write to HA if state changed
        if self._state != new_state:
            self._state = new_state
            _LOGGER.error("🚨 MAIN ENTITY: State updated from %s to %s", self._state, new_state)
            self.async_write_ha_state()

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
            else:
                _LOGGER.debug("Pre-alarm not scheduled: now=%s, pre_alarm_time=%s, executed=%s", 
                            now.strftime("%Y-%m-%d %H:%M:%S"), 
                            pre_alarm_time.strftime("%Y-%m-%d %H:%M:%S"), 
                            self._pre_alarm_executed)

        # Schedule main alarm
        if now < next_alarm and not self._alarm_executed:
            self._alarm_timer = async_track_point_in_time(
                self.hass, self._async_trigger_alarm, next_alarm
            )
            _LOGGER.debug("Main alarm scheduled for: %s", next_alarm.strftime("%Y-%m-%d %H:%M:%S"))
        else:
            _LOGGER.debug("Main alarm not scheduled: now=%s, next_alarm=%s, executed=%s", 
                        now.strftime("%Y-%m-%d %H:%M:%S"), 
                        next_alarm.strftime("%Y-%m-%d %H:%M:%S"), 
                        self._alarm_executed)

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
                        "entity_id": self.entity_id,
                        "name": self.name,
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
                "entity_id": self.entity_id,
                "name": self.name,
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

        # Schedule INDEPENDENT post-alarm timer (if enabled)
        if (self.config.get(CONF_POST_ALARM_ENABLED, False) and 
            self.config.get(CONF_POST_ALARM_SCRIPT) and
            not self._post_alarm_executed):
            post_alarm_time = dt_util.now() + timedelta(
                minutes=self.config.get(CONF_POST_ALARM_MINUTES, 30)
            )
            self._post_alarm_timer = async_track_point_in_time(
                self.hass, self._async_execute_post_alarm, post_alarm_time
            )
            _LOGGER.info("Independent post-alarm scheduled for %s", post_alarm_time.strftime("%H:%M:%S"))

        # Schedule auto-dismiss timer
        auto_dismiss_minutes = self.config.get(CONF_AUTO_DISMISS_MINUTES, 30)
        auto_dismiss_time = dt_util.now() + timedelta(minutes=auto_dismiss_minutes)
        self._auto_dismiss_timer = async_track_point_in_time(
            self.hass, self._async_auto_dismiss, auto_dismiss_time
        )
        _LOGGER.info("Auto-dismiss scheduled for %s (after %d minutes)", 
                    auto_dismiss_time.strftime("%H:%M:%S"), auto_dismiss_minutes)

        self.async_write_ha_state()
        
        # Trigger update of related entities (buttons)
        await self._async_update_related_entities()

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
                        "entity_id": self.entity_id,
                        "name": self.name,
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
            await self._async_update_alarm_state()
            self.async_write_ha_state()
            
            # Trigger immediate update of related entities (sensors, buttons)
            await self._async_update_related_entities()
            
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
        await self._async_update_alarm_state()
        self.async_write_ha_state()

    async def async_toggle_day(self, day: str):
        """Toggle a day of the week."""
        if day in DAYS_OF_WEEK:
            if day in self._enabled_days:
                self._enabled_days.remove(day)
            else:
                self._enabled_days.add(day)
            await self._save_state()
            await self._async_update_alarm_state()
            self.async_write_ha_state()

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

        # Fire event for logbook
        self.hass.bus.async_fire(
            "alarm_clock_snoozed",
            {
                "entity_id": self.entity_id,
                "name": self.name,
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
        self.async_write_ha_state()
        
        # Trigger update of related entities (buttons)
        await self._async_update_related_entities()

    async def async_dismiss(self):
        """Dismiss the alarm."""
        if self._state in [ALARM_STATE_RINGING, ALARM_STATE_SNOOZED]:
            # Fire event for logbook
            self.hass.bus.async_fire(
                "alarm_clock_dismissed",
                {
                    "entity_id": self.entity_id,
                    "name": self.name,
                    "snooze_count": self._snooze_count if self._snooze_count > 0 else None,
                }
            )
            
            # Post-alarm is now independent - no need to schedule here
            
            self._state = ALARM_STATE_OFF
            self._cancel_all_timers()
            self._reset_execution_flags()
            self._snooze_count = 0
            self._snooze_until = None
            _LOGGER.info("Alarm dismissed manually")
            self.async_write_ha_state()

    async def _async_auto_dismiss(self, now):
        """Auto-dismiss the alarm after timeout."""
        if self._state == ALARM_STATE_RINGING:
            # Fire event for logbook
            self.hass.bus.async_fire(
                "alarm_clock_auto_dismissed",
                {
                    "entity_id": self.entity_id,
                    "name": self.name,
                    "auto_dismiss_minutes": self.config.get(CONF_AUTO_DISMISS_MINUTES, 30),
                    "snooze_count": self._snooze_count if self._snooze_count > 0 else None,
                }
            )
            
            self._state = ALARM_STATE_OFF
            # Cancel only snooze and auto-dismiss timers, keep post-alarm if running
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
            self.async_write_ha_state()

    async def _save_state(self):
        """Save the current state to config entry."""
        # Skip saving during initial startup to avoid overwriting restored state
        if self._initial_startup:
            _LOGGER.info("Skipping state save during initial startup")
            return
            
        try:
            # Get the config entry with fresh data
            config_entry = None
            for entry in self.hass.config_entries.async_entries(DOMAIN):
                if entry.entry_id == self.entry_id:
                    config_entry = entry
                    break
            
            if config_entry:
                # Get the latest config data to avoid overwriting other entity changes
                fresh_data = config_entry.data.copy()
                
                # Update only our specific keys
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
                
                # Update our local config reference with fresh data
                self.config = fresh_data
                
                _LOGGER.info("Successfully saved alarm state: time=%s, enabled=%s, days=%s", 
                            self._alarm_time, self._alarm_enabled, self._enabled_days)
                _LOGGER.info("Fresh config data after save: %s", fresh_data)
        except Exception as e:
            _LOGGER.error("Error saving alarm state: %s", e)

    def _reset_execution_flags(self):
        """Reset script execution flags."""
        self._pre_alarm_executed = False
        self._alarm_executed = False
        self._post_alarm_executed = False

    def get_enabled_days(self) -> set:
        """Get enabled days."""
        return self._enabled_days.copy()

    def set_enabled_days(self, days: set):
        """Set enabled days."""
        self._enabled_days = days.copy()
        self.async_write_ha_state()

    def get_alarm_time(self) -> Optional[time]:
        """Get the current alarm time."""
        return self._alarm_time

    def is_alarm_enabled(self) -> bool:
        """Check if alarm is enabled."""
        return self._alarm_enabled

    def get_next_alarm(self) -> Optional[datetime]:
        """Get the next alarm time."""
        return self._next_alarm

    def get_snooze_info(self) -> Dict[str, Any]:
        """Get snooze information."""
        return {
            "count": self._snooze_count,
            "until": self._snooze_until,
            "max": self.config.get(CONF_MAX_SNOOZES, 3),
            "duration": self.config.get(CONF_SNOOZE_DURATION, 9),
        }

    async def _async_update_related_entities(self):
        """Update related entities (buttons, sensors) to reflect new state."""
        # Force update of all related entities by triggering a state update
        entity_registry = er.async_get(self.hass)
        related_entities = []
        
        # Find all entities related to this alarm
        for entity_id in entity_registry.entities:
            entry = entity_registry.entities[entity_id]
            if (entry.platform == DOMAIN and 
                entry.config_entry_id == self.entry_id and
                (entity_id.startswith("button.") or 
                 entity_id.startswith("sensor.") or
                 entity_id.startswith("time."))):
                related_entities.append(entity_id)
        
        # Log related entities that should update automatically
        for entity_id in related_entities:
            if entity_id in self.hass.states.async_entity_ids():
                _LOGGER.debug("Related entity should update automatically: %s", entity_id)
