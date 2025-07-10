"""Button platform for Alarm Clock integration."""
import logging
from typing import Any, Dict, Optional

from homeassistant.components.button import ButtonEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.helpers.update_coordinator import CoordinatorEntity

from .const import DOMAIN, ALARM_STATE_RINGING, ALARM_STATE_SNOOZED
from .coordinator import AlarmClockCoordinator

_LOGGER = logging.getLogger(__name__)


async def async_setup_entry(
    hass: HomeAssistant,
    config_entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Set up the button platform."""
    # Get the coordinator
    entry_data = hass.data[DOMAIN].get(config_entry.entry_id)
    if not entry_data:
        _LOGGER.error("Entry data not found")
        return
    
    coordinator = entry_data.get("coordinator")
    if not coordinator:
        _LOGGER.error("Coordinator not found")
        return

    # Create button entities
    entities = [
        SnoozeButton(coordinator, config_entry),
        DismissButton(coordinator, config_entry),
    ]
    
    async_add_entities(entities)


class SnoozeButton(CoordinatorEntity, ButtonEntity):
    """Button to snooze the alarm."""

    def __init__(self, coordinator: AlarmClockCoordinator, config_entry: ConfigEntry):
        """Initialize the button."""
        super().__init__(coordinator)
        self._config_entry = config_entry

    @property
    def name(self) -> str:
        """Return the name of the button."""
        return f"{self.coordinator.config.get('name', 'Alarm Clock')} Snooze"

    @property
    def unique_id(self) -> str:
        """Return the unique ID."""
        return f"{self.coordinator.unique_id}_snooze_button"

    @property
    def icon(self) -> str:
        """Return the icon to use in the frontend."""
        return "mdi:alarm-snooze"

    @property
    def available(self) -> bool:
        """Return if entity is available."""
        return True  # Always available - action logic handles appropriateness

    @property
    def device_info(self) -> Dict[str, Any]:
        """Return device information."""
        return self.coordinator.device_info

    @property
    def extra_state_attributes(self) -> Dict[str, Any]:
        """Return the state attributes."""
        if self.coordinator.get_state() == ALARM_STATE_RINGING:
            snooze_info = self.coordinator.get_snooze_info()
            return {
                "snooze_count": snooze_info["count"],
                "max_snoozes": snooze_info["max"],
                "snooze_duration": snooze_info["duration"],
                "remaining_snoozes": snooze_info["max"] - snooze_info["count"],
            }
        return {}

    async def async_press(self) -> None:
        """Handle the button press."""
        if self.coordinator.get_state() == ALARM_STATE_RINGING:
            await self.coordinator.async_snooze()


class DismissButton(CoordinatorEntity, ButtonEntity):
    """Button to dismiss the alarm."""

    def __init__(self, coordinator: AlarmClockCoordinator, config_entry: ConfigEntry):
        """Initialize the button."""
        super().__init__(coordinator)
        self._config_entry = config_entry

    @property
    def name(self) -> str:
        """Return the name of the button."""
        return f"{self.coordinator.config.get('name', 'Alarm Clock')} Dismiss"

    @property
    def unique_id(self) -> str:
        """Return the unique ID."""
        return f"{self.coordinator.unique_id}_dismiss_button"

    @property
    def icon(self) -> str:
        """Return the icon to use in the frontend."""
        return "mdi:alarm-off"

    @property
    def available(self) -> bool:
        """Return if entity is available."""
        return True  # Always available - action logic handles appropriateness

    @property
    def device_info(self) -> Dict[str, Any]:
        """Return device information."""
        return self.coordinator.device_info

    async def async_press(self) -> None:
        """Handle the button press."""
        if self.coordinator.get_state() in [ALARM_STATE_RINGING, ALARM_STATE_SNOOZED]:
            await self.coordinator.async_dismiss()
