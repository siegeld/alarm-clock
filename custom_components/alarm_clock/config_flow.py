"""Config flow for Alarm Clock integration."""
import logging
from typing import Any, Dict, Optional

import voluptuous as vol

from homeassistant import config_entries
from homeassistant.core import HomeAssistant, callback
from homeassistant.data_entry_flow import FlowResult
from homeassistant.helpers import selector

from .const import (
    DOMAIN,
    DEFAULT_NAME,
    DEFAULT_SNOOZE_DURATION,
    DEFAULT_MAX_SNOOZES,
    DEFAULT_PRE_ALARM_MINUTES,
    DEFAULT_POST_ALARM_MINUTES,
    DAYS_OF_WEEK,
    CONF_MEDIA_PLAYER_ENTITY,
    CONF_ALARM_SOUND,
    CONF_CUSTOM_SOUND_URL,
    CONF_ALARM_VOLUME,
    CONF_REPEAT_SOUND,
    CONF_REPEAT_INTERVAL,
    BUILTIN_ALARM_SOUNDS,
    DEFAULT_ALARM_VOLUME,
    DEFAULT_ALARM_SOUND,
    DEFAULT_REPEAT_SOUND,
    DEFAULT_REPEAT_INTERVAL,
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

        # Store name for the next step
        self.user_input = user_input
        
        # Move to media player configuration step
        return await self.async_step_media_player()

    async def async_step_media_player(self, user_input: Optional[Dict[str, Any]] = None) -> FlowResult:
        """Handle media player configuration."""
        errors = {}
        
        if user_input is None:
            # Create schema for media player configuration
            sound_options = [
                {"value": key, "label": sound_info["name"]}
                for key, sound_info in BUILTIN_ALARM_SOUNDS.items()
            ]
            
            schema = vol.Schema({
                vol.Optional(CONF_MEDIA_PLAYER_ENTITY): selector.EntitySelector(
                    selector.EntitySelectorConfig(domain="media_player")
                ),
                vol.Optional(CONF_ALARM_SOUND, default=DEFAULT_ALARM_SOUND): selector.SelectSelector(
                    selector.SelectSelectorConfig(
                        options=sound_options,
                        mode=selector.SelectSelectorMode.DROPDOWN,
                    )
                ),
                vol.Optional(CONF_ALARM_VOLUME, default=DEFAULT_ALARM_VOLUME): selector.NumberSelector(
                    selector.NumberSelectorConfig(
                        min=0,
                        max=100,
                        step=5,
                        mode=selector.NumberSelectorMode.SLIDER,
                    )
                ),
                vol.Optional(CONF_REPEAT_SOUND, default=DEFAULT_REPEAT_SOUND): bool,
                vol.Optional(CONF_REPEAT_INTERVAL, default=DEFAULT_REPEAT_INTERVAL): selector.NumberSelector(
                    selector.NumberSelectorConfig(
                        min=1,
                        max=60,
                        step=1,
                        mode=selector.NumberSelectorMode.BOX,
                        unit_of_measurement="s",
                    )
                ),
            })
            
            return self.async_show_form(
                step_id="media_player",
                data_schema=schema,
                errors=errors,
            )

        # Handle custom sound URL
        custom_sound_url = None
        if user_input.get(CONF_ALARM_SOUND) == "custom":
            return await self.async_step_custom_sound(user_input)
        
        # Create the config entry
        config_data = {
            "name": self.user_input["name"],
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
            # Media player settings
            CONF_MEDIA_PLAYER_ENTITY: user_input.get(CONF_MEDIA_PLAYER_ENTITY),
            CONF_ALARM_SOUND: user_input.get(CONF_ALARM_SOUND, DEFAULT_ALARM_SOUND),
            CONF_CUSTOM_SOUND_URL: custom_sound_url,
            CONF_ALARM_VOLUME: user_input.get(CONF_ALARM_VOLUME, DEFAULT_ALARM_VOLUME),
            CONF_REPEAT_SOUND: user_input.get(CONF_REPEAT_SOUND, DEFAULT_REPEAT_SOUND),
            CONF_REPEAT_INTERVAL: user_input.get(CONF_REPEAT_INTERVAL, DEFAULT_REPEAT_INTERVAL),
        }
        
        return self.async_create_entry(
            title=self.user_input["name"],
            data=config_data,
        )

    async def async_step_custom_sound(self, media_player_input: Dict[str, Any], user_input: Optional[Dict[str, Any]] = None) -> FlowResult:
        """Handle custom sound URL configuration."""
        if user_input is None:
            schema = vol.Schema({
                vol.Required(CONF_CUSTOM_SOUND_URL): str,
            })
            
            return self.async_show_form(
                step_id="custom_sound",
                data_schema=schema,
            )

        # Create the config entry with custom sound URL
        config_data = {
            "name": self.user_input["name"],
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
            # Media player settings
            CONF_MEDIA_PLAYER_ENTITY: media_player_input.get(CONF_MEDIA_PLAYER_ENTITY),
            CONF_ALARM_SOUND: media_player_input.get(CONF_ALARM_SOUND, DEFAULT_ALARM_SOUND),
            CONF_CUSTOM_SOUND_URL: user_input.get(CONF_CUSTOM_SOUND_URL),
            CONF_ALARM_VOLUME: media_player_input.get(CONF_ALARM_VOLUME, DEFAULT_ALARM_VOLUME),
            CONF_REPEAT_SOUND: media_player_input.get(CONF_REPEAT_SOUND, DEFAULT_REPEAT_SOUND),
            CONF_REPEAT_INTERVAL: media_player_input.get(CONF_REPEAT_INTERVAL, DEFAULT_REPEAT_INTERVAL),
        }
        
        return self.async_create_entry(
            title=self.user_input["name"],
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
