"""The Alarm Clock integration."""
import logging
from datetime import timedelta

import voluptuous as vol

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers import config_validation as cv
from homeassistant.helpers.typing import ConfigType
from homeassistant.helpers import device_registry as dr

from .const import (
    DOMAIN,
    SERVICE_SNOOZE,
    SERVICE_DISMISS,
    SERVICE_SET_ALARM,
    SERVICE_TOGGLE_DAY,
)

# Additional service for testing
SERVICE_TEST_SOUND = "test_sound"
from .coordinator import AlarmClockCoordinator
from .intent_script import async_setup_intents

_LOGGER = logging.getLogger(__name__)

PLATFORMS = ["sensor", "switch", "time", "number", "text", "button", "select"]


async def async_setup(hass: HomeAssistant, config: ConfigType) -> bool:
    """Set up the Alarm Clock component."""
    return True


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up Alarm Clock from a config entry."""
    _LOGGER.debug("Setting up Alarm Clock integration with entry: %s", entry.data)
    
    hass.data.setdefault(DOMAIN, {})
    
    # Create or get device
    device_registry = dr.async_get(hass)
    device_entry = device_registry.async_get_or_create(
        config_entry_id=entry.entry_id,
        identifiers={(DOMAIN, entry.entry_id)},
        name=entry.data.get("name", "Alarm Clock"),
        manufacturer="Alarm Clock Integration",
        model="Alarm Clock",
        sw_version="2.4.1",
    )
    
    # Create the coordinator
    coordinator = AlarmClockCoordinator(
        hass=hass,
        config=entry.data,
        entry_id=entry.entry_id,
        device_id=device_entry.id,
    )
    
    # Store the coordinator
    hass.data[DOMAIN][entry.entry_id] = {
        "coordinator": coordinator,
        "device_id": device_entry.id,
    }
    
    # Set up the coordinator
    await coordinator.async_setup()
    
    _LOGGER.debug("Setting up platforms: %s", PLATFORMS)
    
    # Set up platforms
    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)
    
    # Register services
    await _async_register_services(hass)
    
    # Register voice intents
    await async_setup_intents(hass)
    
    _LOGGER.info("Alarm Clock integration setup complete")
    
    return True


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Unload a config entry."""
    # Get the coordinator to shut it down properly
    entry_data = hass.data[DOMAIN].get(entry.entry_id)
    if entry_data and "coordinator" in entry_data:
        coordinator = entry_data["coordinator"]
        await coordinator.async_shutdown()
    
    # Unload platforms
    unload_ok = await hass.config_entries.async_unload_platforms(entry, PLATFORMS)
    
    if unload_ok:
        hass.data[DOMAIN].pop(entry.entry_id)
    
    return unload_ok


async def _async_register_services(hass: HomeAssistant) -> None:
    """Register services for the alarm clock."""
    
    def _find_coordinator_by_device_id(device_id: str):
        """Find coordinator by device_id."""
        for entry_id, entry_data in hass.data[DOMAIN].items():
            if isinstance(entry_data, dict) and "coordinator" in entry_data:
                if entry_data.get("device_id") == device_id:
                    return entry_data["coordinator"]
        return None
    
    def _find_coordinator_by_entity_id(entity_id: str):
        """Find coordinator by entity_id (for backward compatibility)."""
        from homeassistant.helpers import entity_registry as er
        
        entity_registry = er.async_get(hass)
        entity_entry = entity_registry.async_get(entity_id)
        
        if entity_entry and entity_entry.device_id:
            return _find_coordinator_by_device_id(entity_entry.device_id)
        return None
    
    async def async_snooze_service(call):
        """Handle snooze service call."""
        device_id = call.data.get("device_id")
        entity_id = call.data.get("entity_id")
        
        coordinator = None
        if device_id:
            coordinator = _find_coordinator_by_device_id(device_id)
        elif entity_id:
            coordinator = _find_coordinator_by_entity_id(entity_id)
        
        if coordinator:
            await coordinator.async_snooze()
        else:
            _LOGGER.error("Alarm clock coordinator not found for device_id: %s, entity_id: %s", device_id, entity_id)
    
    async def async_dismiss_service(call):
        """Handle dismiss service call."""
        device_id = call.data.get("device_id")
        entity_id = call.data.get("entity_id")
        
        coordinator = None
        if device_id:
            coordinator = _find_coordinator_by_device_id(device_id)
        elif entity_id:
            coordinator = _find_coordinator_by_entity_id(entity_id)
        
        if coordinator:
            await coordinator.async_dismiss()
        else:
            _LOGGER.error("Alarm clock coordinator not found for device_id: %s, entity_id: %s", device_id, entity_id)
    
    async def async_set_alarm_service(call):
        """Handle set alarm service call."""
        device_id = call.data.get("device_id")
        entity_id = call.data.get("entity_id")
        time_str = call.data.get("time")
        
        if not time_str:
            _LOGGER.error("Time parameter is required")
            return
        
        coordinator = None
        if device_id:
            coordinator = _find_coordinator_by_device_id(device_id)
        elif entity_id:
            coordinator = _find_coordinator_by_entity_id(entity_id)
        
        if coordinator:
            await coordinator.async_set_alarm_time(time_str)
        else:
            _LOGGER.error("Alarm clock coordinator not found for device_id: %s, entity_id: %s", device_id, entity_id)
    
    async def async_toggle_day_service(call):
        """Handle toggle day service call."""
        device_id = call.data.get("device_id")
        entity_id = call.data.get("entity_id")
        day = call.data.get("day")
        
        if not day:
            _LOGGER.error("Day parameter is required")
            return
        
        coordinator = None
        if device_id:
            coordinator = _find_coordinator_by_device_id(device_id)
        elif entity_id:
            coordinator = _find_coordinator_by_entity_id(entity_id)
        
        if coordinator:
            await coordinator.async_toggle_day(day)
        else:
            _LOGGER.error("Alarm clock coordinator not found for device_id: %s, entity_id: %s", device_id, entity_id)
    
    async def async_test_sound_service(call):
        """Handle test sound service call."""
        device_id = call.data.get("device_id")
        entity_id = call.data.get("entity_id")
        
        coordinator = None
        if device_id:
            coordinator = _find_coordinator_by_device_id(device_id)
        elif entity_id:
            coordinator = _find_coordinator_by_entity_id(entity_id)
        
        if coordinator:
            await coordinator.async_test_sound()
        else:
            _LOGGER.error("Alarm clock coordinator not found for device_id: %s, entity_id: %s", device_id, entity_id)
    
    # Register services with support for both device_id and entity_id
    hass.services.async_register(
        DOMAIN,
        SERVICE_SNOOZE,
        async_snooze_service,
        schema=vol.Schema({
            vol.Optional("device_id"): cv.string,
            vol.Optional("entity_id"): cv.entity_id,
        }),
    )
    
    hass.services.async_register(
        DOMAIN,
        SERVICE_DISMISS,
        async_dismiss_service,
        schema=vol.Schema({
            vol.Optional("device_id"): cv.string,
            vol.Optional("entity_id"): cv.entity_id,
        }),
    )
    
    hass.services.async_register(
        DOMAIN,
        SERVICE_SET_ALARM,
        async_set_alarm_service,
        schema=vol.Schema({
            vol.Optional("device_id"): cv.string,
            vol.Optional("entity_id"): cv.entity_id,
            vol.Required("time"): cv.string,
        }),
    )
    
    hass.services.async_register(
        DOMAIN,
        SERVICE_TOGGLE_DAY,
        async_toggle_day_service,
        schema=vol.Schema({
            vol.Optional("device_id"): cv.string,
            vol.Optional("entity_id"): cv.entity_id,
            vol.Required("day"): cv.string,
        }),
    )
    
    hass.services.async_register(
        DOMAIN,
        SERVICE_TEST_SOUND,
        async_test_sound_service,
        schema=vol.Schema({
            vol.Optional("device_id"): cv.string,
            vol.Optional("entity_id"): cv.entity_id,
        }),
    )
