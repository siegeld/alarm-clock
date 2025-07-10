"""Platform for alarm clock entities."""
import logging
from typing import List

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
    """Set up alarm clock entities from a config entry."""
    _LOGGER.info("Setting up alarm clock entity from config entry")
    
    # Get the stored config data
    entry_data = hass.data[DOMAIN][config_entry.entry_id]
    
    # Create the alarm clock entity
    alarm_entity = AlarmClockEntity(hass, config_entry.data, config_entry.entry_id)
    
    # Store reference to entity for service calls
    entry_data["entity"] = alarm_entity
    
    # Add the entity
    async_add_entities([alarm_entity], True)
    
    _LOGGER.info("Alarm clock entity added successfully")
