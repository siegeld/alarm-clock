"""Text platform for Alarm Clock integration."""
import logging
from typing import Any, Dict, Optional

from homeassistant.components.text import TextEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.helpers.update_coordinator import CoordinatorEntity

from .const import DOMAIN
from .coordinator import AlarmClockCoordinator

_LOGGER = logging.getLogger(__name__)


async def async_setup_entry(
    hass: HomeAssistant,
    config_entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Set up the text platform."""
    # Get the coordinator
    entry_data = hass.data[DOMAIN].get(config_entry.entry_id)
    if not entry_data:
        _LOGGER.error("Entry data not found")
        return
    
    coordinator = entry_data.get("coordinator")
    if not coordinator:
        _LOGGER.error("Coordinator not found")
        return

    # Create text entities for script configuration
    entities = [
        PreAlarmScriptText(coordinator, config_entry),
        AlarmScriptText(coordinator, config_entry),
        PostAlarmScriptText(coordinator, config_entry),
    ]
    
    async_add_entities(entities)


class PreAlarmScriptText(CoordinatorEntity, TextEntity):
    """Text entity for pre-alarm script configuration."""

    def __init__(self, coordinator: AlarmClockCoordinator, config_entry: ConfigEntry):
        """Initialize the text entity."""
        super().__init__(coordinator)
        self._config_entry = config_entry

    @property
    def name(self) -> str:
        """Return the name of the text entity."""
        return f"{self.coordinator.config.get('name', 'Alarm Clock')} Pre-alarm Script"

    @property
    def unique_id(self) -> str:
        """Return the unique ID."""
        return f"{self.coordinator.unique_id}_pre_alarm_script"

    @property
    def native_value(self) -> str:
        """Return the current value."""
        return self.coordinator.config.get("pre_alarm_script", "")

    @property
    def icon(self) -> str:
        """Return the icon to use in the frontend."""
        return "mdi:script-text-outline"

    @property
    def device_info(self) -> Dict[str, Any]:
        """Return device information."""
        return self.coordinator.device_info

    async def async_set_value(self, value: str) -> None:
        """Set the value."""
        # Get fresh config data to avoid overwriting other changes
        fresh_data = self._config_entry.data.copy()
        fresh_data["pre_alarm_script"] = value
        
        # Update the config entry
        self.hass.config_entries.async_update_entry(
            self._config_entry,
            data=fresh_data
        )
        # Update the coordinator config with fresh data
        self.coordinator.config = fresh_data


class AlarmScriptText(CoordinatorEntity, TextEntity):
    """Text entity for alarm script configuration."""

    def __init__(self, coordinator: AlarmClockCoordinator, config_entry: ConfigEntry):
        """Initialize the text entity."""
        super().__init__(coordinator)
        self._config_entry = config_entry

    @property
    def name(self) -> str:
        """Return the name of the text entity."""
        return f"{self.coordinator.config.get('name', 'Alarm Clock')} Alarm Script"

    @property
    def unique_id(self) -> str:
        """Return the unique ID."""
        return f"{self.coordinator.unique_id}_alarm_script"

    @property
    def native_value(self) -> str:
        """Return the current value."""
        return self.coordinator.config.get("alarm_script", "")

    @property
    def icon(self) -> str:
        """Return the icon to use in the frontend."""
        return "mdi:script-text"

    @property
    def device_info(self) -> Dict[str, Any]:
        """Return device information."""
        return self.coordinator.device_info

    async def async_set_value(self, value: str) -> None:
        """Set the value."""
        # Get fresh config data to avoid overwriting other changes
        fresh_data = self._config_entry.data.copy()
        fresh_data["alarm_script"] = value
        
        # Update the config entry
        self.hass.config_entries.async_update_entry(
            self._config_entry,
            data=fresh_data
        )
        # Update the coordinator config with fresh data
        self.coordinator.config = fresh_data


class PostAlarmScriptText(CoordinatorEntity, TextEntity):
    """Text entity for post-alarm script configuration."""

    def __init__(self, coordinator: AlarmClockCoordinator, config_entry: ConfigEntry):
        """Initialize the text entity."""
        super().__init__(coordinator)
        self._config_entry = config_entry

    @property
    def name(self) -> str:
        """Return the name of the text entity."""
        return f"{self.coordinator.config.get('name', 'Alarm Clock')} Post-alarm Script"

    @property
    def unique_id(self) -> str:
        """Return the unique ID."""
        return f"{self.coordinator.unique_id}_post_alarm_script"

    @property
    def native_value(self) -> str:
        """Return the current value."""
        return self.coordinator.config.get("post_alarm_script", "")

    @property
    def icon(self) -> str:
        """Return the icon to use in the frontend."""
        return "mdi:script-text-outline"

    @property
    def device_info(self) -> Dict[str, Any]:
        """Return device information."""
        return self.coordinator.device_info

    async def async_set_value(self, value: str) -> None:
        """Set the value."""
        # Get fresh config data to avoid overwriting other changes
        fresh_data = self._config_entry.data.copy()
        fresh_data["post_alarm_script"] = value
        
        # Update the config entry
        self.hass.config_entries.async_update_entry(
            self._config_entry,
            data=fresh_data
        )
        # Update the coordinator config with fresh data
        self.coordinator.config = fresh_data
