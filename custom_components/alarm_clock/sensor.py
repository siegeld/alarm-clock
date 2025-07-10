"""Sensor platform for Alarm Clock integration."""
import logging
from datetime import datetime, timedelta
from typing import Any, Dict, Optional

from homeassistant.components.sensor import SensorEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.helpers.event import async_track_point_in_time
from homeassistant.util import dt as dt_util

from .const import (
    DOMAIN,
    ENTITY_ID_NEXT_ALARM,
    ENTITY_ID_ALARM_STATUS,
    ENTITY_ID_TIME_UNTIL_ALARM,
    ALARM_STATE_OFF,
    ALARM_STATE_ARMED,
    ALARM_STATE_RINGING,
    ALARM_STATE_SNOOZED,
)
from .alarm_clock import AlarmClockEntity

_LOGGER = logging.getLogger(__name__)


async def async_setup_entry(
    hass: HomeAssistant,
    config_entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Set up the sensor platform."""
    # Get the main alarm clock entity
    entry_data = hass.data[DOMAIN].get(config_entry.entry_id)
    if not entry_data:
        _LOGGER.error("Entry data not found")
        return
    
    alarm_entity = entry_data.get("entity")
    if not alarm_entity:
        _LOGGER.error("Main alarm clock entity not found")
        return

    # Create sensor entities
    next_alarm_sensor = NextAlarmSensor(alarm_entity, config_entry)
    status_sensor = AlarmStatusSensor(alarm_entity, config_entry)
    time_until_sensor = TimeUntilAlarmSensor(alarm_entity, config_entry)
    
    # Register sensor entities with the main alarm entity for updates
    alarm_entity._sensor_entities = [next_alarm_sensor, status_sensor, time_until_sensor]
    
    entities = [
        alarm_entity,  # Add the main alarm clock entity
        next_alarm_sensor,
        status_sensor,
        time_until_sensor,
    ]
    
    async_add_entities(entities)


class NextAlarmSensor(SensorEntity):
    """Sensor that shows the next alarm time."""

    def __init__(self, alarm_entity: AlarmClockEntity, config_entry: ConfigEntry):
        """Initialize the sensor."""
        self._alarm_entity = alarm_entity
        self._config_entry = config_entry

    @property
    def name(self) -> str:
        """Return the name of the sensor."""
        return f"{self._alarm_entity.name} Next Alarm"

    @property
    def unique_id(self) -> str:
        """Return the unique ID."""
        return f"{self._alarm_entity.unique_id}_{ENTITY_ID_NEXT_ALARM}"

    @property
    def native_value(self) -> Optional[datetime]:
        """Return the state of the sensor."""
        return self._alarm_entity.get_next_alarm()

    @property
    def icon(self) -> str:
        """Return the icon to use in the frontend."""
        return "mdi:clock-outline"

    @property
    def device_class(self) -> str:
        """Return the device class."""
        return "timestamp"

    @property
    def device_info(self) -> Dict[str, Any]:
        """Return device information."""
        return {
            "identifiers": {(DOMAIN, self._config_entry.entry_id)},
            "name": self._alarm_entity.name,
            "manufacturer": "Alarm Clock Integration",
            "model": "Alarm Clock",
            "sw_version": "1.0.0",
        }

    @property
    def extra_state_attributes(self) -> Dict[str, Any]:
        """Return the state attributes."""
        next_alarm = self._alarm_entity.get_next_alarm()
        if next_alarm:
            return {
                "next_alarm_date": next_alarm.strftime("%Y-%m-%d"),
                "next_alarm_time": next_alarm.strftime("%H:%M"),
                "next_alarm_day": next_alarm.strftime("%A"),
            }
        return {}


class AlarmStatusSensor(SensorEntity):
    """Sensor that shows the current alarm status."""

    def __init__(self, alarm_entity: AlarmClockEntity, config_entry: ConfigEntry):
        """Initialize the sensor."""
        self._alarm_entity = alarm_entity
        self._config_entry = config_entry

    @property
    def name(self) -> str:
        """Return the name of the sensor."""
        return f"{self._alarm_entity.name} Status"

    @property
    def unique_id(self) -> str:
        """Return the unique ID."""
        return f"{self._alarm_entity.unique_id}_{ENTITY_ID_ALARM_STATUS}"

    @property
    def native_value(self) -> str:
        """Return the state of the sensor."""
        return self._alarm_entity.state

    @property
    def icon(self) -> str:
        """Return the icon to use in the frontend."""
        state = self._alarm_entity.state
        if state == ALARM_STATE_RINGING:
            return "mdi:alarm-bell"
        elif state == ALARM_STATE_SNOOZED:
            return "mdi:alarm-snooze"
        elif state == ALARM_STATE_ARMED:
            return "mdi:alarm"
        else:
            return "mdi:alarm-off"

    @property
    def device_info(self) -> Dict[str, Any]:
        """Return device information."""
        return {
            "identifiers": {(DOMAIN, self._config_entry.entry_id)},
            "name": self._alarm_entity.name,
            "manufacturer": "Alarm Clock Integration",
            "model": "Alarm Clock",
            "sw_version": "1.0.0",
        }

    @property
    def extra_state_attributes(self) -> Dict[str, Any]:
        """Return the state attributes."""
        attributes = {}
        
        # Add alarm enabled status
        attributes["alarm_enabled"] = self._alarm_entity.is_alarm_enabled()
        
        # Add enabled days
        attributes["enabled_days"] = list(self._alarm_entity.get_enabled_days())
        
        # Add alarm time
        alarm_time = self._alarm_entity.get_alarm_time()
        if alarm_time:
            attributes["alarm_time"] = alarm_time.strftime("%H:%M")
        
        # Add snooze info if relevant
        if self._alarm_entity.state in [ALARM_STATE_RINGING, ALARM_STATE_SNOOZED]:
            snooze_info = self._alarm_entity.get_snooze_info()
            attributes["snooze_count"] = snooze_info["count"]
            attributes["max_snoozes"] = snooze_info["max"]
            if snooze_info["until"]:
                attributes["snooze_until"] = snooze_info["until"].strftime("%H:%M:%S")
        
        return attributes


class TimeUntilAlarmSensor(SensorEntity):
    """Sensor that shows time until next alarm."""

    def __init__(self, alarm_entity: AlarmClockEntity, config_entry: ConfigEntry):
        """Initialize the sensor."""
        self._alarm_entity = alarm_entity
        self._config_entry = config_entry
        self._update_timer = None

    @property
    def name(self) -> str:
        """Return the name of the sensor."""
        return f"{self._alarm_entity.name} Time Until Alarm"

    @property
    def unique_id(self) -> str:
        """Return the unique ID."""
        return f"{self._alarm_entity.unique_id}_{ENTITY_ID_TIME_UNTIL_ALARM}"

    @property
    def native_value(self) -> Optional[float]:
        """Return the state of the sensor in minutes."""
        # If alarm is snoozed, show countdown to snooze end
        if self._alarm_entity.state == ALARM_STATE_SNOOZED:
            snooze_info = self._alarm_entity.get_snooze_info()
            snooze_until = snooze_info.get("until")
            if snooze_until:
                now = dt_util.now()
                if snooze_until > now:
                    delta = snooze_until - now
                    return delta.total_seconds() / 60  # Return minutes until snooze ends
        
        # Otherwise show countdown to next alarm
        next_alarm = self._alarm_entity.get_next_alarm()
        if next_alarm:
            now = dt_util.now()
            if next_alarm > now:
                delta = next_alarm - now
                return delta.total_seconds() / 60  # Return minutes
        return None

    @property
    def native_unit_of_measurement(self) -> str:
        """Return the unit of measurement."""
        return "min"

    @property
    def icon(self) -> str:
        """Return the icon to use in the frontend."""
        return "mdi:timer-outline"

    @property
    def device_class(self) -> str:
        """Return the device class."""
        return "duration"

    @property
    def device_info(self) -> Dict[str, Any]:
        """Return device information."""
        return {
            "identifiers": {(DOMAIN, self._config_entry.entry_id)},
            "name": self._alarm_entity.name,
            "manufacturer": "Alarm Clock Integration",
            "model": "Alarm Clock",
            "sw_version": "1.0.0",
        }

    @property
    def extra_state_attributes(self) -> Dict[str, Any]:
        """Return the state attributes."""
        now = dt_util.now()
        target_time = None
        countdown_type = "alarm"
        
        # If alarm is snoozed, show countdown to snooze end
        if self._alarm_entity.state == ALARM_STATE_SNOOZED:
            snooze_info = self._alarm_entity.get_snooze_info()
            snooze_until = snooze_info.get("until")
            if snooze_until and snooze_until > now:
                target_time = snooze_until
                countdown_type = "snooze"
        
        # Otherwise show countdown to next alarm
        if not target_time:
            next_alarm = self._alarm_entity.get_next_alarm()
            if next_alarm and next_alarm > now:
                target_time = next_alarm
                countdown_type = "alarm"
        
        if target_time:
            delta = target_time - now
            hours, remainder = divmod(delta.total_seconds(), 3600)
            minutes, seconds = divmod(remainder, 60)
            
            return {
                "hours": int(hours),
                "minutes": int(minutes),
                "seconds": int(seconds),
                "total_seconds": int(delta.total_seconds()),
                "human_readable": f"{int(hours):02d}:{int(minutes):02d}:{int(seconds):02d}",
                "countdown_type": countdown_type,  # "snooze" or "alarm"
                "target_time": target_time.strftime("%H:%M:%S"),
            }
        return {}

    @property
    def available(self) -> bool:
        """Return if entity is available."""
        # Only available when there's a next alarm
        return self._alarm_entity.get_next_alarm() is not None

    async def async_added_to_hass(self):
        """Run when entity about to be added to hass."""
        # Start the 1-second update timer
        await self._async_schedule_update()

    async def async_will_remove_from_hass(self):
        """Run when entity will be removed from hass."""
        # Cancel the update timer
        if self._update_timer:
            self._update_timer()
            self._update_timer = None

    async def _async_schedule_update(self, now=None):
        """Schedule the next update check."""
        # Update our state
        self.async_write_ha_state()
        
        # Schedule next update in 1 second for real-time countdown
        next_update = dt_util.utcnow() + timedelta(seconds=1)
        self._update_timer = async_track_point_in_time(
            self.hass, self._async_schedule_update, next_update
        )
