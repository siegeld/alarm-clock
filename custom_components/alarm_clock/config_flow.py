"""Config flow for Alarm Clock integration."""
import logging
from typing import Any, Dict, Optional

import voluptuous as vol

from homeassistant import config_entries
from homeassistant.core import HomeAssistant, callback
from homeassistant.data_entry_flow import FlowResult

from .const import (
    DOMAIN,
    DEFAULT_NAME,
    DEFAULT_SNOOZE_DURATION,
    DEFAULT_MAX_SNOOZES,
    DEFAULT_PRE_ALARM_MINUTES,
    DEFAULT_POST_ALARM_MINUTES,
    DAYS_OF_WEEK,
)

_LOGGER = logging.getLogger(__name__)

STEP_USER_DATA_SCHEMA = vol.Schema({
    vol.Required("name", default=DEFAULT_NAME): str,
})


class AlarmClockConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    """Handle a config flow for Alarm Clock."""

    VERSION = 1

    async def async_step_user(self, user_input: Optional[Dict[str, Any]] = None) -> FlowResult:
        """Handle the initial step."""
        if user_input is None:
            return self.async_show_form(
                step_id="user",
                data_schema=STEP_USER_DATA_SCHEMA,
            )

        # Check if name is unique
        await self.async_set_unique_id(user_input["name"])
        self._abort_if_unique_id_configured()

        # Create the config entry with minimal data
        config_data = {
            "name": user_input["name"],
            "alarm_time": "07:00",  # Default alarm time
            # Set default values that can be changed via entities later
            "pre_alarm_enabled": False,
            "pre_alarm_script": "",
            "pre_alarm_minutes": DEFAULT_PRE_ALARM_MINUTES,
            "alarm_script": "",
            "post_alarm_enabled": False,
            "post_alarm_script": "",
            "post_alarm_minutes": DEFAULT_POST_ALARM_MINUTES,
            "snooze_duration": DEFAULT_SNOOZE_DURATION,
            "max_snoozes": DEFAULT_MAX_SNOOZES,
            "default_enabled_days": DAYS_OF_WEEK[:5],  # Weekdays by default
        }
        
        return self.async_create_entry(
            title=user_input["name"],
            data=config_data,
        )

    @staticmethod
    @callback
    def async_get_options_flow(config_entry):
        """Get the options flow for this handler."""
        return AlarmClockOptionsFlow(config_entry)


class AlarmClockOptionsFlow(config_entries.OptionsFlow):
    """Handle options flow for Alarm Clock."""

    def __init__(self, config_entry):
        """Initialize options flow."""
        self.config_entry = config_entry

    async def async_step_init(self, user_input: Optional[Dict[str, Any]] = None) -> FlowResult:
        """Handle options flow."""
        if user_input is None:
            current_data = self.config_entry.data
            
            schema = vol.Schema({
                vol.Required("name", default=current_data.get("name", DEFAULT_NAME)): str,
            })
            
            return self.async_show_form(
                step_id="init",
                data_schema=schema,
            )

        # Update only the name
        self.hass.config_entries.async_update_entry(
            self.config_entry,
            data={**self.config_entry.data, "name": user_input["name"]}
        )
        
        return self.async_create_entry(title="", data={})
