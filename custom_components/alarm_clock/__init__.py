"""The Alarm Clock integration."""
import logging
from datetime import timedelta

import voluptuous as vol

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers import config_validation as cv
from homeassistant.helpers.typing import ConfigType

from .const import (
    DOMAIN,
    SERVICE_SNOOZE,
    SERVICE_DISMISS,
    SERVICE_SET_ALARM,
    SERVICE_TOGGLE_DAY,
)

_LOGGER = logging.getLogger(__name__)

# Set default debug logging for the alarm clock integration
logger = logging.getLogger(f"custom_components.{DOMAIN}")
logger.setLevel(logging.DEBUG)

# Add console handler to ensure we see the logs
console_handler = logging.StreamHandler()
console_handler.setLevel(logging.DEBUG)
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
console_handler.setFormatter(formatter)
logger.addHandler(console_handler)
logger.propagate = True

# Test log on import
_LOGGER.error("ALARM CLOCK INTEGRATION: __init__.py imported successfully")

PLATFORMS = ["sensor", "switch", "time", "number", "text", "button"]


async def async_setup(hass: HomeAssistant, config: ConfigType) -> bool:
    """Set up the Alarm Clock component."""
    return True


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up Alarm Clock from a config entry."""
    _LOGGER.error("ALARM CLOCK INTEGRATION: async_setup_entry called with entry: %s", entry.data)
    
    hass.data.setdefault(DOMAIN, {})
    
    # Import and create the main alarm clock entity
    from .alarm_clock import AlarmClockEntity
    
    _LOGGER.error("ALARM CLOCK INTEGRATION: Creating AlarmClockEntity")
    
    # Create the main alarm clock entity
    alarm_entity = AlarmClockEntity(hass, entry.data, entry.entry_id)
    
    # Store the config entry data and main entity
    hass.data[DOMAIN][entry.entry_id] = {
        "data": entry.data,
        "entity": alarm_entity
    }
    
    _LOGGER.error("ALARM CLOCK INTEGRATION: Setting up platforms: %s", PLATFORMS)
    
    # Set up platforms
    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)
    
    # Register services
    await _async_register_services(hass)
    
    _LOGGER.error("ALARM CLOCK INTEGRATION: Setup complete")
    
    return True


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Unload a config entry."""
    # Unload platforms
    unload_ok = await hass.config_entries.async_unload_platforms(entry, PLATFORMS)
    
    if unload_ok:
        hass.data[DOMAIN].pop(entry.entry_id)
    
    return unload_ok


async def _async_register_services(hass: HomeAssistant) -> None:
    """Register services for the alarm clock."""
    
    def _find_alarm_entity(entity_id: str):
        """Find the alarm clock entity by entity_id."""
        for entry_id, entry_data in hass.data[DOMAIN].items():
            if isinstance(entry_data, dict) and "entity" in entry_data:
                entity = entry_data["entity"]
                if entity and entity.entity_id == entity_id:
                    return entity
        return None
    
    async def async_snooze_service(call):
        """Handle snooze service call."""
        entity_id = call.data.get("entity_id")
        if entity_id:
            entity = _find_alarm_entity(entity_id)
            if entity:
                await entity.async_snooze()
            else:
                _LOGGER.error("Alarm clock entity not found: %s", entity_id)
    
    async def async_dismiss_service(call):
        """Handle dismiss service call."""
        entity_id = call.data.get("entity_id")
        if entity_id:
            entity = _find_alarm_entity(entity_id)
            if entity:
                await entity.async_dismiss()
            else:
                _LOGGER.error("Alarm clock entity not found: %s", entity_id)
    
    async def async_set_alarm_service(call):
        """Handle set alarm service call."""
        entity_id = call.data.get("entity_id")
        time_str = call.data.get("time")
        if entity_id and time_str:
            entity = _find_alarm_entity(entity_id)
            if entity:
                await entity.async_set_alarm_time(time_str)
            else:
                _LOGGER.error("Alarm clock entity not found: %s", entity_id)
    
    async def async_toggle_day_service(call):
        """Handle toggle day service call."""
        entity_id = call.data.get("entity_id")
        day = call.data.get("day")
        if entity_id and day:
            entity = _find_alarm_entity(entity_id)
            if entity:
                await entity.async_toggle_day(day)
            else:
                _LOGGER.error("Alarm clock entity not found: %s", entity_id)
    
    # Register services
    hass.services.async_register(
        DOMAIN,
        SERVICE_SNOOZE,
        async_snooze_service,
        schema=vol.Schema({
            vol.Required("entity_id"): cv.entity_id,
        }),
    )
    
    hass.services.async_register(
        DOMAIN,
        SERVICE_DISMISS,
        async_dismiss_service,
        schema=vol.Schema({
            vol.Required("entity_id"): cv.entity_id,
        }),
    )
    
    hass.services.async_register(
        DOMAIN,
        SERVICE_SET_ALARM,
        async_set_alarm_service,
        schema=vol.Schema({
            vol.Required("entity_id"): cv.entity_id,
            vol.Required("time"): cv.string,
        }),
    )
    
    hass.services.async_register(
        DOMAIN,
        SERVICE_TOGGLE_DAY,
        async_toggle_day_service,
        schema=vol.Schema({
            vol.Required("entity_id"): cv.entity_id,
            vol.Required("day"): cv.string,
        }),
    )
