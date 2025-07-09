"""Time platform for Alarm Clock integration."""
import logging
from datetime import time
from typing import Any, Dict, Optional

from homeassistant.components.time import TimeEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from .const import DOMAIN, ENTITY_ID_ALARM_TIME
from .alarm_clock import AlarmClockEntity

_LOGGER = logging.getLogger(__name__)


async def async_setup_entry(
    hass: HomeAssistant,
    config_entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Set up the time platform."""
    # Get the main alarm clock entity
    entry_data = hass.data[DOMAIN].get(config_entry.entry_id)
    if not entry_data:
        _LOGGER.error("Entry data not found")
        return
    
    alarm_entity = entry_data.get("entity")
    if not alarm_entity:
        _LOGGER.error("Main alarm clock entity not found")
        return

    # Create time entity
    time_entity = AlarmTimeEntity(alarm_entity, config_entry)
    async_add_entities([time_entity])


class AlarmTimeEntity(TimeEntity):
    """Time entity for setting alarm time."""

    def __init__(self, alarm_entity: AlarmClockEntity, config_entry: ConfigEntry):
        """Initialize the time entity."""
        self._alarm_entity = alarm_entity
        self._config_entry = config_entry

    @property
    def name(self) -> str:
        """Return the name of the time entity."""
        return f"{self._alarm_entity.name} Time"

    @property
    def unique_id(self) -> str:
        """Return the unique ID."""
        return f"{self._alarm_entity.unique_id}_{ENTITY_ID_ALARM_TIME}"

    @property
    def native_value(self) -> Optional[time]:
        """Return the current time value."""
        # Always get time from alarm entity (which includes restored state)
        return self._alarm_entity.get_alarm_time()

    @property
    def icon(self) -> str:
        """Return the icon to use in the frontend."""
        return "mdi:clock-time-four-outline"

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

    async def async_set_value(self, value: time) -> None:
        """Set the time value."""
        time_str = value.strftime("%H:%M")
        await self._alarm_entity.async_set_alarm_time(time_str)
        self.async_write_ha_state()
