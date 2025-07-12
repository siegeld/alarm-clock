"""Select platform for Alarm Clock integration."""
import logging
from typing import Any, Dict, Optional

from homeassistant.components.select import SelectEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.helpers.entity import EntityCategory

from .const import (
    DOMAIN,
    CONF_MEDIA_PLAYER_ENTITY,
    CONF_ALARM_SOUND,
    BUILTIN_ALARM_SOUNDS,
    DEFAULT_ALARM_SOUND,
)
from homeassistant.helpers.update_coordinator import CoordinatorEntity
from .coordinator import AlarmClockCoordinator

_LOGGER = logging.getLogger(__name__)


async def async_setup_entry(
    hass: HomeAssistant,
    config_entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Set up the Alarm Clock select entities."""
    # Get the coordinator
    entry_data = hass.data[DOMAIN].get(config_entry.entry_id)
    if not entry_data:
        _LOGGER.error("Entry data not found")
        return
    
    coordinator = entry_data.get("coordinator")
    if not coordinator:
        _LOGGER.error("Coordinator not found")
        return
    
    entities = [
        AlarmClockMediaPlayerSelect(coordinator, config_entry),
        AlarmClockSoundSelect(coordinator, config_entry),
    ]
    
    async_add_entities(entities)


class AlarmClockMediaPlayerSelect(CoordinatorEntity, SelectEntity):
    """Select entity for choosing media player."""

    def __init__(self, coordinator: AlarmClockCoordinator, config_entry: ConfigEntry):
        """Initialize the media player select entity."""
        super().__init__(coordinator)
        self._config_entry = config_entry

    @property
    def name(self) -> str:
        """Return the name of the select entity."""
        return f"{self.coordinator.config.get('name', 'Alarm Clock')} Media Player"

    @property
    def unique_id(self) -> str:
        """Return the unique ID."""
        return f"{self.coordinator.unique_id}_media_player"

    @property
    def entity_category(self) -> EntityCategory:
        """Return the entity category."""
        return EntityCategory.CONFIG

    @property
    def icon(self) -> str:
        """Return the icon to use in the frontend."""
        return "mdi:speaker"

    @property
    def device_info(self) -> Dict[str, Any]:
        """Return device information."""
        return self.coordinator.device_info

    @property
    def options(self) -> list[str]:
        """Return the list of available media players."""
        media_players = []
        
        # Add "None" option for no media player
        media_players.append("None")
        
        # Get all media player entities
        for entity_id in self.hass.states.async_entity_ids("media_player"):
            state = self.hass.states.get(entity_id)
            if state:
                # Use friendly name if available, otherwise entity_id
                name = state.attributes.get("friendly_name", entity_id)
                media_players.append(f"{name} ({entity_id})")
        
        return media_players

    @property
    def current_option(self) -> Optional[str]:
        """Return the current selected media player."""
        media_player = self.coordinator.config.get(CONF_MEDIA_PLAYER_ENTITY)
        
        if not media_player:
            return "None"
        
        # Find the option that matches this entity_id
        for option in self.options:
            if option != "None" and f"({media_player})" in option:
                return option
        
        # If not found in current options, return None to show first option
        return "None"

    async def async_select_option(self, option: str) -> None:
        """Change the selected media player."""
        if option == "None":
            media_player = None
        else:
            # Extract entity_id from "Name (entity_id)" format
            if "(" in option and option.endswith(")"):
                media_player = option.split("(")[-1][:-1]
            else:
                media_player = option
        
        await self.coordinator.async_set_media_player_entity(media_player)


class AlarmClockSoundSelect(CoordinatorEntity, SelectEntity):
    """Select entity for choosing alarm sound."""

    def __init__(self, coordinator: AlarmClockCoordinator, config_entry: ConfigEntry):
        """Initialize the alarm sound select entity."""
        super().__init__(coordinator)
        self._config_entry = config_entry

    @property
    def name(self) -> str:
        """Return the name of the select entity."""
        return f"{self.coordinator.config.get('name', 'Alarm Clock')} Alarm Sound"

    @property
    def unique_id(self) -> str:
        """Return the unique ID."""
        return f"{self.coordinator.unique_id}_alarm_sound"

    @property
    def entity_category(self) -> EntityCategory:
        """Return the entity category."""
        return EntityCategory.CONFIG

    @property
    def icon(self) -> str:
        """Return the icon to use in the frontend."""
        return "mdi:music-note"

    @property
    def device_info(self) -> Dict[str, Any]:
        """Return device information."""
        return self.coordinator.device_info

    @property
    def options(self) -> list[str]:
        """Return the list of available alarm sounds."""
        return [sound_info["name"] for sound_info in BUILTIN_ALARM_SOUNDS.values()]

    @property
    def current_option(self) -> Optional[str]:
        """Return the current selected alarm sound."""
        alarm_sound = self.coordinator.config.get(CONF_ALARM_SOUND, DEFAULT_ALARM_SOUND)
        
        # Return the friendly name for the current sound
        if alarm_sound in BUILTIN_ALARM_SOUNDS:
            return BUILTIN_ALARM_SOUNDS[alarm_sound]["name"]
        
        # Fallback to the key itself
        return BUILTIN_ALARM_SOUNDS.get(DEFAULT_ALARM_SOUND, {}).get("name", "Classic Alarm Beep")

    async def async_select_option(self, option: str) -> None:
        """Change the selected alarm sound."""
        # Find the sound key for this friendly name
        sound_key = None
        for key, sound_info in BUILTIN_ALARM_SOUNDS.items():
            if sound_info["name"] == option:
                sound_key = key
                break
        
        if sound_key:
            await self.coordinator.async_set_alarm_sound(sound_key)
        else:
            _LOGGER.error("Unknown alarm sound option: %s", option)
