"""Intent scripts for Alarm Clock voice commands."""
import logging
import re
from datetime import time
from typing import Any, Dict, Optional

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers import intent
from homeassistant.helpers import device_registry as dr
from homeassistant.helpers import entity_registry as er
from homeassistant.helpers import area_registry as ar

from .const import DOMAIN, DAYS_OF_WEEK

_LOGGER = logging.getLogger(__name__)

# Time parsing patterns
TIME_PATTERNS = [
    # 7:30, 07:30, 7:30 AM, 07:30 PM
    r'(\d{1,2}):(\d{2})\s*([AP]M)?',
    # 7 AM, 7 PM, seven AM, seven PM
    r'(\d{1,2}|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve)\s*([AP]M)',
    # 7:30 in the morning, 7:30 at night
    r'(\d{1,2}):(\d{2})\s*(?:in the|at)\s*(morning|night|evening)',
]

# Word to number mapping for time parsing
WORD_TO_NUM = {
    'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5, 'six': 6,
    'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10, 'eleven': 11, 'twelve': 12,
    'thirteen': 13, 'fourteen': 14, 'fifteen': 15, 'sixteen': 16,
    'seventeen': 17, 'eighteen': 18, 'nineteen': 19, 'twenty': 20,
    'thirty': 30, 'forty': 40, 'fifty': 50
}


async def async_setup_intents(hass: HomeAssistant) -> None:
    """Set up voice intents for alarm clock."""
    
    # Set alarm intent
    intent.async_register(hass, SetAlarmIntent())
    
    # Enable/disable alarm intents
    intent.async_register(hass, EnableAlarmIntent())
    intent.async_register(hass, DisableAlarmIntent())
    
    # Snooze and dismiss intents
    intent.async_register(hass, SnoozeAlarmIntent())
    intent.async_register(hass, DismissAlarmIntent())
    
    # Status query intent
    intent.async_register(hass, AlarmStatusIntent())
    
    # Day management intents
    intent.async_register(hass, EnableDayIntent())
    intent.async_register(hass, DisableDayIntent())


def _find_alarm_coordinator_by_area(hass: HomeAssistant, area_id: str):
    """Find alarm coordinator by area/room."""
    device_registry = dr.async_get(hass)
    entity_registry = er.async_get(hass)
    
    # Get all alarm clock devices
    alarm_devices = [
        device for device in device_registry.devices.values()
        if device.manufacturer == "Alarm Clock Integration"
    ]
    
    # Find device in the specified area
    for device in alarm_devices:
        if device.area_id == area_id:
            # Find coordinator for this device
            for entry_id, entry_data in hass.data[DOMAIN].items():
                if isinstance(entry_data, dict) and "device_id" in entry_data:
                    if entry_data["device_id"] == device.id:
                        return entry_data.get("coordinator")
    
    return None


def _find_alarm_coordinator_by_name(hass: HomeAssistant, name: str):
    """Find alarm coordinator by name."""
    for entry_id, entry_data in hass.data[DOMAIN].items():
        if isinstance(entry_data, dict) and "coordinator" in entry_data:
            coordinator = entry_data["coordinator"]
            if coordinator.config.get("name", "").lower() == name.lower():
                return coordinator
    return None


def _parse_time(text: str) -> Optional[time]:
    """Parse time from text."""
    for pattern in TIME_PATTERNS:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            groups = match.groups()
            
            if len(groups) >= 2 and groups[1] and groups[1].isdigit():
                # Pattern with hour:minute
                hour = int(groups[0]) if groups[0].isdigit() else WORD_TO_NUM.get(groups[0].lower(), 0)
                minute = int(groups[1])
                am_pm = groups[2] if len(groups) > 2 else None
                
            elif len(groups) >= 2 and groups[1] and groups[1].upper() in ['AM', 'PM']:
                # Pattern with hour AM/PM
                hour = int(groups[0]) if groups[0].isdigit() else WORD_TO_NUM.get(groups[0].lower(), 0)
                minute = 0
                am_pm = groups[1]
                
            else:
                continue
            
            # Convert to 24-hour format
            if am_pm:
                am_pm = am_pm.upper()
                if am_pm == 'PM' and hour != 12:
                    hour += 12
                elif am_pm == 'AM' and hour == 12:
                    hour = 0
            elif 'morning' in text.lower() and hour <= 12:
                # Morning context
                if hour == 12:
                    hour = 0
            elif ('night' in text.lower() or 'evening' in text.lower()) and hour <= 12:
                # Evening/night context
                if hour != 12:
                    hour += 12
            
            if 0 <= hour <= 23 and 0 <= minute <= 59:
                return time(hour, minute)
    
    return None


class SetAlarmIntent(intent.IntentHandler):
    """Handle set alarm intent."""
    
    intent_type = "AlarmSetTime"
    slot_schema = {
        "time": str,
        "name": str,
    }
    
    async def async_handle(self, intent_obj: intent.Intent) -> intent.IntentResponse:
        """Handle the intent."""
        try:
            hass = intent_obj.hass
            time_str = intent_obj.slots.get("time", {}).get("value")
            name = intent_obj.slots.get("name", {}).get("value")
            
            if not time_str:
                return intent.IntentResponse(speech="I need a time to set the alarm for")
            
            # Parse the time
            parsed_time = _parse_time(time_str)
            if not parsed_time:
                return intent.IntentResponse(speech="I couldn't understand that time")
            
            # Find the coordinator
            coordinator = None
            if intent_obj.device_id:
                # Try to find by device area
                area_registry = ar.async_get(hass)
                device_registry = dr.async_get(hass)
                device = device_registry.async_get(intent_obj.device_id)
                if device and device.area_id:
                    coordinator = _find_alarm_coordinator_by_area(hass, device.area_id)
            
            if not coordinator and name:
                coordinator = _find_alarm_coordinator_by_name(hass, name)
            
            if not coordinator:
                # Get the first available coordinator
                for entry_id, entry_data in hass.data[DOMAIN].items():
                    if isinstance(entry_data, dict) and "coordinator" in entry_data:
                        coordinator = entry_data["coordinator"]
                        break
            
            if not coordinator:
                return intent.IntentResponse(speech="I couldn't find an alarm clock to set")
            
            # Set the alarm
            time_24h = parsed_time.strftime("%H:%M")
            await coordinator.async_set_alarm_time(time_24h)
            
            # Enable the alarm if it's not already enabled
            if not coordinator.get_alarm_enabled():
                await coordinator.async_set_alarm_enabled(True)
            
            time_12h = parsed_time.strftime("%I:%M %p").lower()
            return intent.IntentResponse(speech=f"Alarm set for {time_12h}")
        
        except Exception as e:
            _LOGGER.error("Error in SetAlarmIntent: %s", e)
            return intent.IntentResponse(speech="I couldn't set the alarm. Please try again.")


class EnableAlarmIntent(intent.IntentHandler):
    """Handle enable alarm intent."""
    
    intent_type = "AlarmEnable"
    slot_schema = {
        "name": str,
    }
    
    async def async_handle(self, intent_obj: intent.Intent) -> intent.IntentResponse:
        """Handle the intent."""
        try:
            hass = intent_obj.hass
            name = intent_obj.slots.get("name", {}).get("value")
            
            # Find the coordinator
            coordinator = None
            if intent_obj.device_id:
                # Try to find by device area
                area_registry = ar.async_get(hass)
                device_registry = dr.async_get(hass)
                device = device_registry.async_get(intent_obj.device_id)
                if device and device.area_id:
                    coordinator = _find_alarm_coordinator_by_area(hass, device.area_id)
            
            if not coordinator and name:
                coordinator = _find_alarm_coordinator_by_name(hass, name)
            
            if not coordinator:
                # Get the first available coordinator
                for entry_id, entry_data in hass.data[DOMAIN].items():
                    if isinstance(entry_data, dict) and "coordinator" in entry_data:
                        coordinator = entry_data["coordinator"]
                        break
            
            if not coordinator:
                return intent.IntentResponse(speech="I couldn't find an alarm clock")
            
            await coordinator.async_set_alarm_enabled(True)
            
            alarm_time = coordinator.get_alarm_time()
            time_str = alarm_time.strftime('%I:%M %p').lower() if alarm_time else "the set time"
            
            return intent.IntentResponse(speech=f"Alarm enabled for {time_str}")
        
        except Exception as e:
            _LOGGER.error("Error in EnableAlarmIntent: %s", e)
            return intent.IntentResponse(speech="I couldn't enable the alarm. Please try again.")


class DisableAlarmIntent(intent.IntentHandler):
    """Handle disable alarm intent."""
    
    intent_type = "AlarmDisable"
    slot_schema = {
        "name": str,
    }
    
    async def async_handle(self, intent_obj: intent.Intent) -> intent.IntentResponse:
        """Handle the intent."""
        try:
            hass = intent_obj.hass
            name = intent_obj.slots.get("name", {}).get("value")
            
            # Find the coordinator
            coordinator = None
            if intent_obj.device_id:
                # Try to find by device area
                area_registry = ar.async_get(hass)
                device_registry = dr.async_get(hass)
                device = device_registry.async_get(intent_obj.device_id)
                if device and device.area_id:
                    coordinator = _find_alarm_coordinator_by_area(hass, device.area_id)
            
            if not coordinator and name:
                coordinator = _find_alarm_coordinator_by_name(hass, name)
            
            if not coordinator:
                # Get the first available coordinator
                for entry_id, entry_data in hass.data[DOMAIN].items():
                    if isinstance(entry_data, dict) and "coordinator" in entry_data:
                        coordinator = entry_data["coordinator"]
                        break
            
            if not coordinator:
                return intent.IntentResponse(speech="I couldn't find an alarm clock")
            
            await coordinator.async_set_alarm_enabled(False)
            
            return intent.IntentResponse(speech="Alarm disabled")
        
        except Exception as e:
            _LOGGER.error("Error in DisableAlarmIntent: %s", e)
            return intent.IntentResponse(speech="I couldn't disable the alarm. Please try again.")


class SnoozeAlarmIntent(intent.IntentHandler):
    """Handle snooze alarm intent."""
    
    intent_type = "AlarmSnooze"
    slot_schema = {
        "name": str,
    }
    
    async def async_handle(self, intent_obj: intent.Intent) -> intent.IntentResponse:
        """Handle the intent."""
        try:
            hass = intent_obj.hass
            name = intent_obj.slots.get("name", {}).get("value")
            
            # Find the coordinator
            coordinator = None
            if intent_obj.device_id:
                # Try to find by device area
                area_registry = ar.async_get(hass)
                device_registry = dr.async_get(hass)
                device = device_registry.async_get(intent_obj.device_id)
                if device and device.area_id:
                    coordinator = _find_alarm_coordinator_by_area(hass, device.area_id)
            
            if not coordinator and name:
                coordinator = _find_alarm_coordinator_by_name(hass, name)
            
            if not coordinator:
                # Get the first available coordinator
                for entry_id, entry_data in hass.data[DOMAIN].items():
                    if isinstance(entry_data, dict) and "coordinator" in entry_data:
                        coordinator = entry_data["coordinator"]
                        break
            
            if not coordinator:
                return intent.IntentResponse(speech="I couldn't find an alarm clock")
            
            await coordinator.async_snooze()
            
            snooze_duration = coordinator.config.get('snooze_duration', 9)
            return intent.IntentResponse(speech=f"Alarm snoozed for {snooze_duration} minutes")
        
        except Exception as e:
            _LOGGER.error("Error in SnoozeAlarmIntent: %s", e)
            return intent.IntentResponse(speech="I couldn't snooze the alarm. Please try again.")


class DismissAlarmIntent(intent.IntentHandler):
    """Handle dismiss alarm intent."""
    
    intent_type = "AlarmDismiss"
    slot_schema = {
        "name": str,
    }
    
    async def async_handle(self, intent_obj: intent.Intent) -> intent.IntentResponse:
        """Handle the intent."""
        try:
            hass = intent_obj.hass
            name = intent_obj.slots.get("name", {}).get("value")
            
            # Find the coordinator
            coordinator = None
            if intent_obj.device_id:
                # Try to find by device area
                area_registry = ar.async_get(hass)
                device_registry = dr.async_get(hass)
                device = device_registry.async_get(intent_obj.device_id)
                if device and device.area_id:
                    coordinator = _find_alarm_coordinator_by_area(hass, device.area_id)
            
            if not coordinator and name:
                coordinator = _find_alarm_coordinator_by_name(hass, name)
            
            if not coordinator:
                # Get the first available coordinator
                for entry_id, entry_data in hass.data[DOMAIN].items():
                    if isinstance(entry_data, dict) and "coordinator" in entry_data:
                        coordinator = entry_data["coordinator"]
                        break
            
            if not coordinator:
                return intent.IntentResponse(speech="I couldn't find an alarm clock")
            
            await coordinator.async_dismiss()
            
            return intent.IntentResponse(speech="Alarm dismissed")
        
        except Exception as e:
            _LOGGER.error("Error in DismissAlarmIntent: %s", e)
            return intent.IntentResponse(speech="I couldn't dismiss the alarm. Please try again.")


class AlarmStatusIntent(intent.IntentHandler):
    """Handle alarm status query intent."""
    
    intent_type = "AlarmStatus"
    slot_schema = {
        "name": str,
    }
    
    async def async_handle(self, intent_obj: intent.Intent) -> intent.IntentResponse:
        """Handle the intent."""
        try:
            hass = intent_obj.hass
            name = intent_obj.slots.get("name", {}).get("value")
            
            # Find the coordinator
            coordinator = None
            if intent_obj.device_id:
                # Try to find by device area
                area_registry = ar.async_get(hass)
                device_registry = dr.async_get(hass)
                device = device_registry.async_get(intent_obj.device_id)
                if device and device.area_id:
                    coordinator = _find_alarm_coordinator_by_area(hass, device.area_id)
            
            if not coordinator and name:
                coordinator = _find_alarm_coordinator_by_name(hass, name)
            
            if not coordinator:
                # Get the first available coordinator
                for entry_id, entry_data in hass.data[DOMAIN].items():
                    if isinstance(entry_data, dict) and "coordinator" in entry_data:
                        coordinator = entry_data["coordinator"]
                        break
            
            if not coordinator:
                return intent.IntentResponse(speech="I couldn't find an alarm clock")
            
            alarm_time = coordinator.get_alarm_time()
            alarm_enabled = coordinator.get_alarm_enabled()
            
            if not alarm_time:
                return intent.IntentResponse(speech="No alarm time is set")
            
            time_str = alarm_time.strftime('%I:%M %p').lower()
            status = "enabled" if alarm_enabled else "disabled"
            
            return intent.IntentResponse(speech=f"Your alarm is set for {time_str} and is currently {status}")
        
        except Exception as e:
            _LOGGER.error("Error in AlarmStatusIntent: %s", e)
            return intent.IntentResponse(speech="I couldn't get the alarm status. Please try again.")


class EnableDayIntent(intent.IntentHandler):
    """Handle enable day intent."""
    
    intent_type = "AlarmEnableDay"
    slot_schema = {
        "day": str,
        "name": str,
    }
    
    async def async_handle(self, intent_obj: intent.Intent) -> intent.IntentResponse:
        """Handle the intent."""
        try:
            hass = intent_obj.hass
            day = intent_obj.slots.get("day", {}).get("value")
            name = intent_obj.slots.get("name", {}).get("value")
            
            if not day:
                return intent.IntentResponse(speech="I need to know which day to enable")
            
            day_lower = day.lower()
            if day_lower not in DAYS_OF_WEEK:
                return intent.IntentResponse(speech="I don't recognize that day")
            
            # Find the coordinator
            coordinator = None
            if intent_obj.device_id:
                # Try to find by device area
                area_registry = ar.async_get(hass)
                device_registry = dr.async_get(hass)
                device = device_registry.async_get(intent_obj.device_id)
                if device and device.area_id:
                    coordinator = _find_alarm_coordinator_by_area(hass, device.area_id)
            
            if not coordinator and name:
                coordinator = _find_alarm_coordinator_by_name(hass, name)
            
            if not coordinator:
                # Get the first available coordinator
                for entry_id, entry_data in hass.data[DOMAIN].items():
                    if isinstance(entry_data, dict) and "coordinator" in entry_data:
                        coordinator = entry_data["coordinator"]
                        break
            
            if not coordinator:
                return intent.IntentResponse(speech="I couldn't find an alarm clock")
            
            enabled_days = coordinator.get_enabled_days()
            if day_lower not in enabled_days:
                await coordinator.async_toggle_day(day_lower)
            
            return intent.IntentResponse(speech=f"Alarm enabled for {day.title()}")
        
        except Exception as e:
            _LOGGER.error("Error in EnableDayIntent: %s", e)
            return intent.IntentResponse(speech="I couldn't enable the alarm for that day. Please try again.")


class DisableDayIntent(intent.IntentHandler):
    """Handle disable day intent."""
    
    intent_type = "AlarmDisableDay"
    slot_schema = {
        "day": str,
        "name": str,
    }
    
    async def async_handle(self, intent_obj: intent.Intent) -> intent.IntentResponse:
        """Handle the intent."""
        try:
            hass = intent_obj.hass
            day = intent_obj.slots.get("day", {}).get("value")
            name = intent_obj.slots.get("name", {}).get("value")
            
            if not day:
                return intent.IntentResponse(speech="I need to know which day to disable")
            
            day_lower = day.lower()
            if day_lower not in DAYS_OF_WEEK:
                return intent.IntentResponse(speech="I don't recognize that day")
            
            # Find the coordinator
            coordinator = None
            if intent_obj.device_id:
                # Try to find by device area
                area_registry = ar.async_get(hass)
                device_registry = dr.async_get(hass)
                device = device_registry.async_get(intent_obj.device_id)
                if device and device.area_id:
                    coordinator = _find_alarm_coordinator_by_area(hass, device.area_id)
            
            if not coordinator and name:
                coordinator = _find_alarm_coordinator_by_name(hass, name)
            
            if not coordinator:
                # Get the first available coordinator
                for entry_id, entry_data in hass.data[DOMAIN].items():
                    if isinstance(entry_data, dict) and "coordinator" in entry_data:
                        coordinator = entry_data["coordinator"]
                        break
            
            if not coordinator:
                return intent.IntentResponse(speech="I couldn't find an alarm clock")
            
            enabled_days = coordinator.get_enabled_days()
            if day_lower in enabled_days:
                await coordinator.async_toggle_day(day_lower)
            
            return intent.IntentResponse(speech=f"Alarm disabled for {day.title()}")
        
        except Exception as e:
            _LOGGER.error("Error in DisableDayIntent: %s", e)
            return intent.IntentResponse(speech="I couldn't disable the alarm for that day. Please try again.")
