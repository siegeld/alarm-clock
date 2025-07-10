"""Number platform for Alarm Clock integration."""
import logging
from typing import Any, Dict, Optional

from homeassistant.components.number import NumberEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.helpers.update_coordinator import CoordinatorEntity

from .const import (
    DOMAIN,
    DEFAULT_PRE_ALARM_MINUTES,
    DEFAULT_POST_ALARM_MINUTES,
    DEFAULT_SNOOZE_DURATION,
    DEFAULT_MAX_SNOOZES,
    DEFAULT_AUTO_DISMISS_MINUTES,
)
from .coordinator import AlarmClockCoordinator

_LOGGER = logging.getLogger(__name__)


async def async_setup_entry(
    hass: HomeAssistant,
    config_entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Set up the number platform."""
    # Get the coordinator
    entry_data = hass.data[DOMAIN].get(config_entry.entry_id)
    if not entry_data:
        _LOGGER.error("Entry data not found")
        return
    
    coordinator = entry_data.get("coordinator")
    if not coordinator:
        _LOGGER.error("Coordinator not found")
        return

    # Create number entities
    entities = [
        PreAlarmMinutesNumber(coordinator, config_entry),
        PostAlarmMinutesNumber(coordinator, config_entry),
        SnoozeDurationNumber(coordinator, config_entry),
        MaxSnoozesNumber(coordinator, config_entry),
        AutoDismissMinutesNumber(coordinator, config_entry),
    ]
    
    async_add_entities(entities)


class PreAlarmMinutesNumber(CoordinatorEntity, NumberEntity):
    """Number entity for pre-alarm minutes setting."""

    def __init__(self, coordinator: AlarmClockCoordinator, config_entry: ConfigEntry):
        """Initialize the number entity."""
        super().__init__(coordinator)
        self._config_entry = config_entry

    @property
    def name(self) -> str:
        """Return the name of the number entity."""
        return f"{self.coordinator.config.get('name', 'Alarm Clock')} Pre-alarm Minutes"

    @property
    def unique_id(self) -> str:
        """Return the unique ID."""
        return f"{self.coordinator.unique_id}_pre_alarm_minutes"

    @property
    def native_value(self) -> float:
        """Return the current value."""
        return self.coordinator.config.get("pre_alarm_minutes", DEFAULT_PRE_ALARM_MINUTES)

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
        return self.coordinator.device_info

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
        # Update the coordinator config with fresh data
        self.coordinator.config = fresh_data


class AutoDismissMinutesNumber(CoordinatorEntity, NumberEntity):
    """Number entity for auto-dismiss minutes setting."""

    def __init__(self, coordinator: AlarmClockCoordinator, config_entry: ConfigEntry):
        """Initialize the number entity."""
        super().__init__(coordinator)
        self._config_entry = config_entry

    @property
    def name(self) -> str:
        """Return the name of the number entity."""
        return f"{self.coordinator.config.get('name', 'Alarm Clock')} Auto Dismiss Minutes"

    @property
    def unique_id(self) -> str:
        """Return the unique ID."""
        return f"{self.coordinator.unique_id}_auto_dismiss_minutes"

    @property
    def native_value(self) -> float:
        """Return the current value."""
        return self.coordinator.config.get("auto_dismiss_minutes", DEFAULT_AUTO_DISMISS_MINUTES)

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
        return self.coordinator.device_info

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
        # Update the coordinator config with fresh data
        self.coordinator.config = fresh_data


class PostAlarmMinutesNumber(CoordinatorEntity, NumberEntity):
    """Number entity for post-alarm minutes setting."""

    def __init__(self, coordinator: AlarmClockCoordinator, config_entry: ConfigEntry):
        """Initialize the number entity."""
        super().__init__(coordinator)
        self._config_entry = config_entry

    @property
    def name(self) -> str:
        """Return the name of the number entity."""
        return f"{self.coordinator.config.get('name', 'Alarm Clock')} Post-alarm Minutes"

    @property
    def unique_id(self) -> str:
        """Return the unique ID."""
        return f"{self.coordinator.unique_id}_post_alarm_minutes"

    @property
    def native_value(self) -> float:
        """Return the current value."""
        return self.coordinator.config.get("post_alarm_minutes", DEFAULT_POST_ALARM_MINUTES)

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
        return self.coordinator.device_info

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
        # Update the coordinator config with fresh data
        self.coordinator.config = fresh_data


class SnoozeDurationNumber(CoordinatorEntity, NumberEntity):
    """Number entity for snooze duration setting."""

    def __init__(self, coordinator: AlarmClockCoordinator, config_entry: ConfigEntry):
        """Initialize the number entity."""
        super().__init__(coordinator)
        self._config_entry = config_entry

    @property
    def name(self) -> str:
        """Return the name of the number entity."""
        return f"{self.coordinator.config.get('name', 'Alarm Clock')} Snooze Duration"

    @property
    def unique_id(self) -> str:
        """Return the unique ID."""
        return f"{self.coordinator.unique_id}_snooze_duration"

    @property
    def native_value(self) -> float:
        """Return the current value."""
        return self.coordinator.config.get("snooze_duration", DEFAULT_SNOOZE_DURATION)

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
        return self.coordinator.device_info

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
        # Update the coordinator config with fresh data
        self.coordinator.config = fresh_data


class MaxSnoozesNumber(CoordinatorEntity, NumberEntity):
    """Number entity for maximum snoozes setting."""

    def __init__(self, coordinator: AlarmClockCoordinator, config_entry: ConfigEntry):
        """Initialize the number entity."""
        super().__init__(coordinator)
        self._config_entry = config_entry

    @property
    def name(self) -> str:
        """Return the name of the number entity."""
        return f"{self.coordinator.config.get('name', 'Alarm Clock')} Max Snoozes"

    @property
    def unique_id(self) -> str:
        """Return the unique ID."""
        return f"{self.coordinator.unique_id}_max_snoozes"

    @property
    def native_value(self) -> float:
        """Return the current value."""
        return self.coordinator.config.get("max_snoozes", DEFAULT_MAX_SNOOZES)

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
        return self.coordinator.device_info

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
        # Update the coordinator config with fresh data
        self.coordinator.config = fresh_data
