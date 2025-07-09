"""Number platform for Alarm Clock integration."""
import logging
from typing import Any, Dict, Optional

from homeassistant.components.number import NumberEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from .const import (
    DOMAIN,
    DEFAULT_PRE_ALARM_MINUTES,
    DEFAULT_POST_ALARM_MINUTES,
    DEFAULT_SNOOZE_DURATION,
    DEFAULT_MAX_SNOOZES,
    DEFAULT_AUTO_DISMISS_MINUTES,
)
from .alarm_clock import AlarmClockEntity

_LOGGER = logging.getLogger(__name__)


async def async_setup_entry(
    hass: HomeAssistant,
    config_entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Set up the number platform."""
    # Get the main alarm clock entity
    entry_data = hass.data[DOMAIN].get(config_entry.entry_id)
    if not entry_data:
        _LOGGER.error("Entry data not found")
        return
    
    alarm_entity = entry_data.get("entity")
    if not alarm_entity:
        _LOGGER.error("Main alarm clock entity not found")
        return

    # Create number entities
    entities = [
        PreAlarmMinutesNumber(alarm_entity, config_entry),
        PostAlarmMinutesNumber(alarm_entity, config_entry),
        SnoozeDurationNumber(alarm_entity, config_entry),
        MaxSnoozesNumber(alarm_entity, config_entry),
        AutoDismissMinutesNumber(alarm_entity, config_entry),
    ]
    
    async_add_entities(entities)


class PreAlarmMinutesNumber(NumberEntity):
    """Number entity for pre-alarm minutes setting."""

    def __init__(self, alarm_entity: AlarmClockEntity, config_entry: ConfigEntry):
        """Initialize the number entity."""
        self._alarm_entity = alarm_entity
        self._config_entry = config_entry

    @property
    def name(self) -> str:
        """Return the name of the number entity."""
        return f"{self._alarm_entity.name} Pre-alarm Minutes"

    @property
    def unique_id(self) -> str:
        """Return the unique ID."""
        return f"{self._alarm_entity.unique_id}_pre_alarm_minutes"

    @property
    def native_value(self) -> float:
        """Return the current value."""
        return self._config_entry.data.get("pre_alarm_minutes", DEFAULT_PRE_ALARM_MINUTES)

    @property
    def native_min_value(self) -> float:
        """Return the minimum value."""
        return 1

    @property
    def native_max_value(self) -> float:
        """Return the maximum value."""
        return 60

    @property
    def native_step(self) -> float:
        """Return the step value."""
        return 1

    @property
    def icon(self) -> str:
        """Return the icon to use in the frontend."""
        return "mdi:timer-outline"

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

    async def async_set_native_value(self, value: float) -> None:
        """Set the value."""
        # Get fresh config data to avoid overwriting other changes
        fresh_data = self._config_entry.data.copy()
        fresh_data["pre_alarm_minutes"] = int(value)
        
        # Update the config entry
        self.hass.config_entries.async_update_entry(
            self._config_entry,
            data=fresh_data
        )
        # Update the alarm entity config with fresh data
        self._alarm_entity.config = fresh_data
        self.async_write_ha_state()


class AutoDismissMinutesNumber(NumberEntity):
    """Number entity for auto-dismiss minutes setting."""

    def __init__(self, alarm_entity: AlarmClockEntity, config_entry: ConfigEntry):
        """Initialize the number entity."""
        self._alarm_entity = alarm_entity
        self._config_entry = config_entry

    @property
    def name(self) -> str:
        """Return the name of the number entity."""
        return f"{self._alarm_entity.name} Auto Dismiss Minutes"

    @property
    def unique_id(self) -> str:
        """Return the unique ID."""
        return f"{self._alarm_entity.unique_id}_auto_dismiss_minutes"

    @property
    def native_value(self) -> float:
        """Return the current value."""
        return self._config_entry.data.get("auto_dismiss_minutes", DEFAULT_AUTO_DISMISS_MINUTES)

    @property
    def native_min_value(self) -> float:
        """Return the minimum value."""
        return 1

    @property
    def native_max_value(self) -> float:
        """Return the maximum value."""
        return 120

    @property
    def native_step(self) -> float:
        """Return the step value."""
        return 1

    @property
    def native_unit_of_measurement(self) -> str:
        """Return the unit of measurement."""
        return "min"

    @property
    def icon(self) -> str:
        """Return the icon to use in the frontend."""
        return "mdi:timer-off"

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

    async def async_set_native_value(self, value: float) -> None:
        """Set the value."""
        # Get fresh config data to avoid overwriting other changes
        fresh_data = self._config_entry.data.copy()
        fresh_data["auto_dismiss_minutes"] = int(value)
        
        # Update the config entry
        self.hass.config_entries.async_update_entry(
            self._config_entry,
            data=fresh_data
        )
        # Update the alarm entity config with fresh data
        self._alarm_entity.config = fresh_data
        self.async_write_ha_state()


class PostAlarmMinutesNumber(NumberEntity):
    """Number entity for post-alarm minutes setting."""

    def __init__(self, alarm_entity: AlarmClockEntity, config_entry: ConfigEntry):
        """Initialize the number entity."""
        self._alarm_entity = alarm_entity
        self._config_entry = config_entry

    @property
    def name(self) -> str:
        """Return the name of the number entity."""
        return f"{self._alarm_entity.name} Post-alarm Minutes"

    @property
    def unique_id(self) -> str:
        """Return the unique ID."""
        return f"{self._alarm_entity.unique_id}_post_alarm_minutes"

    @property
    def native_value(self) -> float:
        """Return the current value."""
        return self._config_entry.data.get("post_alarm_minutes", DEFAULT_POST_ALARM_MINUTES)

    @property
    def native_min_value(self) -> float:
        """Return the minimum value."""
        return 1

    @property
    def native_max_value(self) -> float:
        """Return the maximum value."""
        return 120

    @property
    def native_step(self) -> float:
        """Return the step value."""
        return 1

    @property
    def icon(self) -> str:
        """Return the icon to use in the frontend."""
        return "mdi:timer-outline"

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

    async def async_set_native_value(self, value: float) -> None:
        """Set the value."""
        # Get fresh config data to avoid overwriting other changes
        fresh_data = self._config_entry.data.copy()
        fresh_data["post_alarm_minutes"] = int(value)
        
        # Update the config entry
        self.hass.config_entries.async_update_entry(
            self._config_entry,
            data=fresh_data
        )
        # Update the alarm entity config with fresh data
        self._alarm_entity.config = fresh_data
        self.async_write_ha_state()


class SnoozeDurationNumber(NumberEntity):
    """Number entity for snooze duration setting."""

    def __init__(self, alarm_entity: AlarmClockEntity, config_entry: ConfigEntry):
        """Initialize the number entity."""
        self._alarm_entity = alarm_entity
        self._config_entry = config_entry

    @property
    def name(self) -> str:
        """Return the name of the number entity."""
        return f"{self._alarm_entity.name} Snooze Duration"

    @property
    def unique_id(self) -> str:
        """Return the unique ID."""
        return f"{self._alarm_entity.unique_id}_snooze_duration"

    @property
    def native_value(self) -> float:
        """Return the current value."""
        return self._config_entry.data.get("snooze_duration", DEFAULT_SNOOZE_DURATION)

    @property
    def native_min_value(self) -> float:
        """Return the minimum value."""
        return 1

    @property
    def native_max_value(self) -> float:
        """Return the maximum value."""
        return 30

    @property
    def native_step(self) -> float:
        """Return the step value."""
        return 1

    @property
    def native_unit_of_measurement(self) -> str:
        """Return the unit of measurement."""
        return "min"

    @property
    def icon(self) -> str:
        """Return the icon to use in the frontend."""
        return "mdi:alarm-snooze"

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

    async def async_set_native_value(self, value: float) -> None:
        """Set the value."""
        # Get fresh config data to avoid overwriting other changes
        fresh_data = self._config_entry.data.copy()
        fresh_data["snooze_duration"] = int(value)
        
        # Update the config entry
        self.hass.config_entries.async_update_entry(
            self._config_entry,
            data=fresh_data
        )
        # Update the alarm entity config with fresh data
        self._alarm_entity.config = fresh_data
        self.async_write_ha_state()


class MaxSnoozesNumber(NumberEntity):
    """Number entity for maximum snoozes setting."""

    def __init__(self, alarm_entity: AlarmClockEntity, config_entry: ConfigEntry):
        """Initialize the number entity."""
        self._alarm_entity = alarm_entity
        self._config_entry = config_entry

    @property
    def name(self) -> str:
        """Return the name of the number entity."""
        return f"{self._alarm_entity.name} Max Snoozes"

    @property
    def unique_id(self) -> str:
        """Return the unique ID."""
        return f"{self._alarm_entity.unique_id}_max_snoozes"

    @property
    def native_value(self) -> float:
        """Return the current value."""
        return self._config_entry.data.get("max_snoozes", DEFAULT_MAX_SNOOZES)

    @property
    def native_min_value(self) -> float:
        """Return the minimum value."""
        return 1

    @property
    def native_max_value(self) -> float:
        """Return the maximum value."""
        return 10

    @property
    def native_step(self) -> float:
        """Return the step value."""
        return 1

    @property
    def icon(self) -> str:
        """Return the icon to use in the frontend."""
        return "mdi:counter"

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

    async def async_set_native_value(self, value: float) -> None:
        """Set the value."""
        # Get fresh config data to avoid overwriting other changes
        fresh_data = self._config_entry.data.copy()
        fresh_data["max_snoozes"] = int(value)
        
        # Update the config entry
        self.hass.config_entries.async_update_entry(
            self._config_entry,
            data=fresh_data
        )
        # Update the alarm entity config with fresh data
        self._alarm_entity.config = fresh_data
        self.async_write_ha_state()
