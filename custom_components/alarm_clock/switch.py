"""Switch platform for Alarm Clock integration."""
import logging
from typing import Any, Dict, Optional

from homeassistant.components.switch import SwitchEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from .const import (
    DOMAIN,
    ENTITY_ID_ALARM_ENABLED,
    ENTITY_ID_SNOOZE,
    DAYS_OF_WEEK,
    ALARM_STATE_RINGING,
)
from .alarm_clock import AlarmClockEntity

_LOGGER = logging.getLogger(__name__)


async def async_setup_entry(
    hass: HomeAssistant,
    config_entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Set up the switch platform."""
    # Get the main alarm clock entity
    entry_data = hass.data[DOMAIN].get(config_entry.entry_id)
    if not entry_data:
        _LOGGER.error("Entry data not found")
        return
    
    alarm_entity = entry_data.get("entity")
    if not alarm_entity:
        _LOGGER.error("Main alarm clock entity not found")
        return

    # Create switch entities
    entities = []
    
    # Main alarm enable/disable switch
    entities.append(AlarmEnabledSwitch(alarm_entity, config_entry))
    
    # Day of week switches
    for day in DAYS_OF_WEEK:
        entities.append(DayOfWeekSwitch(alarm_entity, config_entry, day))
    
    # Pre/Post alarm enable switches
    entities.append(PreAlarmEnabledSwitch(alarm_entity, config_entry))
    entities.append(PostAlarmEnabledSwitch(alarm_entity, config_entry))
    
    async_add_entities(entities)


class AlarmEnabledSwitch(SwitchEntity):
    """Switch to enable/disable the alarm."""

    def __init__(self, alarm_entity: AlarmClockEntity, config_entry: ConfigEntry):
        """Initialize the switch."""
        self._alarm_entity = alarm_entity
        self._config_entry = config_entry

    @property
    def name(self) -> str:
        """Return the name of the switch."""
        return f"{self._alarm_entity.name} Enabled"

    @property
    def unique_id(self) -> str:
        """Return the unique ID."""
        return f"{self._alarm_entity.unique_id}_{ENTITY_ID_ALARM_ENABLED}"

    @property
    def is_on(self) -> bool:
        """Return true if the alarm is enabled."""
        return self._alarm_entity.is_alarm_enabled()

    @property
    def icon(self) -> str:
        """Return the icon to use in the frontend."""
        return "mdi:alarm-check" if self.is_on else "mdi:alarm-off"

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

    async def async_turn_on(self, **kwargs: Any) -> None:
        """Turn the alarm on."""
        await self._alarm_entity.async_set_alarm_enabled(True)
        self.async_write_ha_state()

    async def async_turn_off(self, **kwargs: Any) -> None:
        """Turn the alarm off."""
        await self._alarm_entity.async_set_alarm_enabled(False)
        self.async_write_ha_state()


class DayOfWeekSwitch(SwitchEntity):
    """Switch to enable/disable alarm for a specific day of the week."""

    def __init__(self, alarm_entity: AlarmClockEntity, config_entry: ConfigEntry, day: str):
        """Initialize the switch."""
        self._alarm_entity = alarm_entity
        self._config_entry = config_entry
        self._day = day

    @property
    def name(self) -> str:
        """Return the name of the switch."""
        return f"{self._alarm_entity.name} {self._day.title()}"

    @property
    def unique_id(self) -> str:
        """Return the unique ID."""
        return f"{self._alarm_entity.unique_id}_{self._day}"

    @property
    def is_on(self) -> bool:
        """Return true if the alarm is enabled for this day."""
        enabled_days = self._alarm_entity.get_enabled_days()
        return self._day in enabled_days

    @property
    def icon(self) -> str:
        """Return the icon to use in the frontend."""
        return "mdi:calendar-check" if self.is_on else "mdi:calendar-remove"

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

    async def async_turn_on(self, **kwargs: Any) -> None:
        """Enable alarm for this day."""
        await self._alarm_entity.async_toggle_day(self._day)
        self.async_write_ha_state()

    async def async_turn_off(self, **kwargs: Any) -> None:
        """Disable alarm for this day."""
        await self._alarm_entity.async_toggle_day(self._day)
        self.async_write_ha_state()


class PreAlarmEnabledSwitch(SwitchEntity):
    """Switch to enable/disable pre-alarm functionality."""

    def __init__(self, alarm_entity: AlarmClockEntity, config_entry: ConfigEntry):
        """Initialize the switch."""
        self._alarm_entity = alarm_entity
        self._config_entry = config_entry

    @property
    def name(self) -> str:
        """Return the name of the switch."""
        return f"{self._alarm_entity.name} Pre-alarm Enabled"

    @property
    def unique_id(self) -> str:
        """Return the unique ID."""
        return f"{self._alarm_entity.unique_id}_pre_alarm_enabled"

    @property
    def is_on(self) -> bool:
        """Return true if pre-alarm is enabled."""
        return self._config_entry.data.get("pre_alarm_enabled", False)

    @property
    def icon(self) -> str:
        """Return the icon to use in the frontend."""
        return "mdi:alarm-plus" if self.is_on else "mdi:alarm-multiple"

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

    async def async_turn_on(self, **kwargs: Any) -> None:
        """Enable pre-alarm."""
        new_data = {**self._config_entry.data, "pre_alarm_enabled": True}
        self.hass.config_entries.async_update_entry(
            self._config_entry,
            data=new_data
        )
        self._alarm_entity.config = new_data
        self.async_write_ha_state()

    async def async_turn_off(self, **kwargs: Any) -> None:
        """Disable pre-alarm."""
        new_data = {**self._config_entry.data, "pre_alarm_enabled": False}
        self.hass.config_entries.async_update_entry(
            self._config_entry,
            data=new_data
        )
        self._alarm_entity.config = new_data
        self.async_write_ha_state()


class PostAlarmEnabledSwitch(SwitchEntity):
    """Switch to enable/disable post-alarm functionality."""

    def __init__(self, alarm_entity: AlarmClockEntity, config_entry: ConfigEntry):
        """Initialize the switch."""
        self._alarm_entity = alarm_entity
        self._config_entry = config_entry

    @property
    def name(self) -> str:
        """Return the name of the switch."""
        return f"{self._alarm_entity.name} Post-alarm Enabled"

    @property
    def unique_id(self) -> str:
        """Return the unique ID."""
        return f"{self._alarm_entity.unique_id}_post_alarm_enabled"

    @property
    def is_on(self) -> bool:
        """Return true if post-alarm is enabled."""
        return self._config_entry.data.get("post_alarm_enabled", False)

    @property
    def icon(self) -> str:
        """Return the icon to use in the frontend."""
        return "mdi:alarm-plus" if self.is_on else "mdi:alarm-multiple"

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

    async def async_turn_on(self, **kwargs: Any) -> None:
        """Enable post-alarm."""
        new_data = {**self._config_entry.data, "post_alarm_enabled": True}
        self.hass.config_entries.async_update_entry(
            self._config_entry,
            data=new_data
        )
        self._alarm_entity.config = new_data
        self.async_write_ha_state()

    async def async_turn_off(self, **kwargs: Any) -> None:
        """Disable post-alarm."""
        new_data = {**self._config_entry.data, "post_alarm_enabled": False}
        self.hass.config_entries.async_update_entry(
            self._config_entry,
            data=new_data
        )
        self._alarm_entity.config = new_data
        self.async_write_ha_state()
