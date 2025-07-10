"""Main alarm clock entity for Home Assistant."""
import logging
from typing import Any, Dict

from homeassistant.components.sensor import SensorEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.helpers.update_coordinator import CoordinatorEntity

from .const import (
    DOMAIN,
    ALARM_STATE_OFF,
    ALARM_STATE_ARMED,
    ALARM_STATE_RINGING,
    ALARM_STATE_SNOOZED,
)
from .coordinator import AlarmClockCoordinator

_LOGGER = logging.getLogger(__name__)


class AlarmClockEntity(CoordinatorEntity, SensorEntity):
    """Main alarm clock entity - thin wrapper around coordinator."""

    def __init__(self, coordinator: AlarmClockCoordinator, config_entry: ConfigEntry):
        """Initialize the alarm clock entity."""
        super().__init__(coordinator)
        self._config_entry = config_entry

    @property
    def name(self) -> str:
        """Return the name of the alarm clock."""
        return self.coordinator.config.get("name", "Alarm Clock")

    @property
    def unique_id(self) -> str:
        """Return the unique ID."""
        return self.coordinator.unique_id

    @property
    def native_value(self) -> str:
        """Return the current state."""
        return self.coordinator.get_state()

    @property
    def state(self) -> str:
        """Return the current state."""
        return self.coordinator.get_state()

    @property
    def extra_state_attributes(self) -> Dict[str, Any]:
        """Return the state attributes."""
        return self.coordinator.get_state_attributes()

    @property
    def icon(self) -> str:
        """Return the icon to use in the frontend."""
        state = self.coordinator.get_state()
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
        return self.coordinator.device_info

    # Convenience methods for backward compatibility and service calls
    async def async_set_alarm_time(self, time_str: str):
        """Set the alarm time."""
        await self.coordinator.async_set_alarm_time(time_str)

    async def async_set_alarm_enabled(self, enabled: bool):
        """Enable or disable the alarm."""
        await self.coordinator.async_set_alarm_enabled(enabled)

    async def async_toggle_day(self, day: str):
        """Toggle a day of the week."""
        await self.coordinator.async_toggle_day(day)

    async def async_snooze(self):
        """Snooze the alarm."""
        await self.coordinator.async_snooze()

    async def async_dismiss(self):
        """Dismiss the alarm."""
        await self.coordinator.async_dismiss()

    def get_enabled_days(self) -> set:
        """Get enabled days."""
        return self.coordinator.get_enabled_days()

    def get_alarm_time(self):
        """Get the current alarm time."""
        return self.coordinator.get_alarm_time()

    def is_alarm_enabled(self) -> bool:
        """Check if alarm is enabled."""
        return self.coordinator.get_alarm_enabled()

    def get_next_alarm(self):
        """Get the next alarm time."""
        return self.coordinator.get_next_alarm()

    def get_snooze_info(self) -> Dict[str, Any]:
        """Get snooze information."""
        return self.coordinator.get_snooze_info()
