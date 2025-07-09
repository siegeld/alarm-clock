"""Button platform for Alarm Clock integration."""
import logging
from typing import Any, Dict, Optional

from homeassistant.components.button import ButtonEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from .const import DOMAIN, ALARM_STATE_RINGING, ALARM_STATE_SNOOZED
from .alarm_clock import AlarmClockEntity

_LOGGER = logging.getLogger(__name__)


async def async_setup_entry(
    hass: HomeAssistant,
    config_entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Set up the button platform."""
    # Get the main alarm clock entity
    entry_data = hass.data[DOMAIN].get(config_entry.entry_id)
    if not entry_data:
        _LOGGER.error("Entry data not found")
        return
    
    alarm_entity = entry_data.get("entity")
    if not alarm_entity:
        _LOGGER.error("Main alarm clock entity not found")
        return

    # Create button entities
    entities = [
        SnoozeButton(alarm_entity, config_entry),
        DismissButton(alarm_entity, config_entry),
    ]
    
    async_add_entities(entities)


class SnoozeButton(ButtonEntity):
    """Button to snooze the alarm."""

    def __init__(self, alarm_entity: AlarmClockEntity, config_entry: ConfigEntry):
        """Initialize the button."""
        self._alarm_entity = alarm_entity
        self._config_entry = config_entry

    @property
    def name(self) -> str:
        """Return the name of the button."""
        return f"{self._alarm_entity.name} Snooze"

    @property
    def unique_id(self) -> str:
        """Return the unique ID."""
        return f"{self._alarm_entity.unique_id}_snooze_button"

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
        if self._alarm_entity.state == ALARM_STATE_RINGING:
            snooze_info = self._alarm_entity.get_snooze_info()
            return {
                "snooze_count": snooze_info["count"],
                "max_snoozes": snooze_info["max"],
                "snooze_duration": snooze_info["duration"],
                "remaining_snoozes": snooze_info["max"] - snooze_info["count"],
            }
        return {}

    async def async_press(self) -> None:
        """Handle the button press."""
        if self._alarm_entity.state == ALARM_STATE_RINGING:
            await self._alarm_entity.async_snooze()


class DismissButton(ButtonEntity):
    """Button to dismiss the alarm."""

    def __init__(self, alarm_entity: AlarmClockEntity, config_entry: ConfigEntry):
        """Initialize the button."""
        self._alarm_entity = alarm_entity
        self._config_entry = config_entry

    @property
    def name(self) -> str:
        """Return the name of the button."""
        return f"{self._alarm_entity.name} Dismiss"

    @property
    def unique_id(self) -> str:
        """Return the unique ID."""
        return f"{self._alarm_entity.unique_id}_dismiss_button"

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
        return {
            "identifiers": {(DOMAIN, self._config_entry.entry_id)},
            "name": self._alarm_entity.name,
            "manufacturer": "Alarm Clock Integration",
            "model": "Alarm Clock",
            "sw_version": "1.0.0",
        }

    async def async_press(self) -> None:
        """Handle the button press."""
        if self._alarm_entity.state in [ALARM_STATE_RINGING, ALARM_STATE_SNOOZED]:
            await self._alarm_entity.async_dismiss()
