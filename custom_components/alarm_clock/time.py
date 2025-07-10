"""Time platform for Alarm Clock integration."""
import logging
from datetime import time
from typing import Any, Dict, Optional

from homeassistant.components.time import TimeEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.helpers.update_coordinator import CoordinatorEntity

from .const import DOMAIN, ENTITY_ID_ALARM_TIME
from .coordinator import AlarmClockCoordinator

_LOGGER = logging.getLogger(__name__)


async def async_setup_entry(
    hass: HomeAssistant,
    config_entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Set up the time platform."""
    # Get the coordinator
    entry_data = hass.data[DOMAIN].get(config_entry.entry_id)
    if not entry_data:
        _LOGGER.error("Entry data not found")
        return
    
    coordinator = entry_data.get("coordinator")
    if not coordinator:
        _LOGGER.error("Coordinator not found")
        return

    # Create time entity
    time_entity = AlarmTimeEntity(coordinator, config_entry)
    async_add_entities([time_entity])


class AlarmTimeEntity(CoordinatorEntity, TimeEntity):
    """Time entity for setting alarm time."""

    def __init__(self, coordinator: AlarmClockCoordinator, config_entry: ConfigEntry):
        """Initialize the time entity."""
        super().__init__(coordinator)
        self._config_entry = config_entry

    @property
    def name(self) -> str:
        """Return the name of the time entity."""
        return f"{self.coordinator.config.get('name', 'Alarm Clock')} Time"

    @property
    def unique_id(self) -> str:
        """Return the unique ID."""
        return f"{self.coordinator.unique_id}_{ENTITY_ID_ALARM_TIME}"

    @property
    def native_value(self) -> Optional[time]:
        """Return the current time value."""
        return self.coordinator.get_alarm_time()

    @property
    def icon(self) -> str:
        """Return the icon to use in the frontend."""
        return "mdi:clock-time-four-outline"

    @property
    def device_info(self) -> Dict[str, Any]:
        """Return device information."""
        return self.coordinator.device_info

    async def async_set_value(self, value: time) -> None:
        """Set the time value."""
        time_str = value.strftime("%H:%M")
        await self.coordinator.async_set_alarm_time(time_str)
