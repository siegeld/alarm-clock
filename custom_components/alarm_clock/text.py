"""Text platform for Alarm Clock integration."""
import logging
from typing import Any, Dict, Optional

from homeassistant.components.text import TextEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from .const import DOMAIN
from .alarm_clock import AlarmClockEntity

_LOGGER = logging.getLogger(__name__)


async def async_setup_entry(
    hass: HomeAssistant,
    config_entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Set up the text platform."""
    # Get the main alarm clock entity
    entry_data = hass.data[DOMAIN].get(config_entry.entry_id)
    if not entry_data:
        _LOGGER.error("Entry data not found")
        return
    
    alarm_entity = entry_data.get("entity")
    if not alarm_entity:
        _LOGGER.error("Main alarm clock entity not found")
        return

    # Create text entities for script configuration
    entities = [
        PreAlarmScriptText(alarm_entity, config_entry),
        AlarmScriptText(alarm_entity, config_entry),
        PostAlarmScriptText(alarm_entity, config_entry),
    ]
    
    async_add_entities(entities)


class PreAlarmScriptText(TextEntity):
    """Text entity for pre-alarm script configuration."""

    def __init__(self, alarm_entity: AlarmClockEntity, config_entry: ConfigEntry):
        """Initialize the text entity."""
        self._alarm_entity = alarm_entity
        self._config_entry = config_entry

    @property
    def name(self) -> str:
        """Return the name of the text entity."""
        return f"{self._alarm_entity.name} Pre-alarm Script"

    @property
    def unique_id(self) -> str:
        """Return the unique ID."""
        return f"{self._alarm_entity.unique_id}_pre_alarm_script"

    @property
    def native_value(self) -> str:
        """Return the current value."""
        return self._config_entry.data.get("pre_alarm_script", "")

    @property
    def icon(self) -> str:
        """Return the icon to use in the frontend."""
        return "mdi:script-text-outline"

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
        # Update the alarm entity config with fresh data
        self._alarm_entity.config = fresh_data
        self.async_write_ha_state()


class AlarmScriptText(TextEntity):
    """Text entity for alarm script configuration."""

    def __init__(self, alarm_entity: AlarmClockEntity, config_entry: ConfigEntry):
        """Initialize the text entity."""
        self._alarm_entity = alarm_entity
        self._config_entry = config_entry

    @property
    def name(self) -> str:
        """Return the name of the text entity."""
        return f"{self._alarm_entity.name} Alarm Script"

    @property
    def unique_id(self) -> str:
        """Return the unique ID."""
        return f"{self._alarm_entity.unique_id}_alarm_script"

    @property
    def native_value(self) -> str:
        """Return the current value."""
        return self._config_entry.data.get("alarm_script", "")

    @property
    def icon(self) -> str:
        """Return the icon to use in the frontend."""
        return "mdi:script-text"

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
        # Update the alarm entity config with fresh data
        self._alarm_entity.config = fresh_data
        self.async_write_ha_state()


class PostAlarmScriptText(TextEntity):
    """Text entity for post-alarm script configuration."""

    def __init__(self, alarm_entity: AlarmClockEntity, config_entry: ConfigEntry):
        """Initialize the text entity."""
        self._alarm_entity = alarm_entity
        self._config_entry = config_entry

    @property
    def name(self) -> str:
        """Return the name of the text entity."""
        return f"{self._alarm_entity.name} Post-alarm Script"

    @property
    def unique_id(self) -> str:
        """Return the unique ID."""
        return f"{self._alarm_entity.unique_id}_post_alarm_script"

    @property
    def native_value(self) -> str:
        """Return the current value."""
        return self._config_entry.data.get("post_alarm_script", "")

    @property
    def icon(self) -> str:
        """Return the icon to use in the frontend."""
        return "mdi:script-text-outline"

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
        # Update the alarm entity config with fresh data
        self._alarm_entity.config = fresh_data
        self.async_write_ha_state()
