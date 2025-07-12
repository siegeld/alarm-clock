"""Switch platform for Alarm Clock integration."""
import logging
from typing import Any, Dict, Optional

from homeassistant.components.switch import SwitchEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.helpers.update_coordinator import CoordinatorEntity

from .const import (
    DOMAIN,
    ENTITY_ID_ALARM_ENABLED,
    ENTITY_ID_SNOOZE,
    DAYS_OF_WEEK,
    ALARM_STATE_RINGING,
    CONF_REPEAT_SOUND,
    DEFAULT_REPEAT_SOUND,
)
from .coordinator import AlarmClockCoordinator

_LOGGER = logging.getLogger(__name__)


async def async_setup_entry(
    hass: HomeAssistant,
    config_entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Set up the switch platform."""
    # Get the coordinator
    entry_data = hass.data[DOMAIN].get(config_entry.entry_id)
    if not entry_data:
        _LOGGER.error("Entry data not found")
        return
    
    coordinator = entry_data.get("coordinator")
    if not coordinator:
        _LOGGER.error("Coordinator not found")
        return

    # Create switch entities
    entities = []
    
    # Main alarm enable/disable switch
    entities.append(AlarmEnabledSwitch(coordinator, config_entry))
    
    # Day of week switches
    for day in DAYS_OF_WEEK:
        entities.append(DayOfWeekSwitch(coordinator, config_entry, day))
    
    # Pre/Post alarm enable switches
    entities.append(PreAlarmEnabledSwitch(coordinator, config_entry))
    entities.append(PostAlarmEnabledSwitch(coordinator, config_entry))
    
    # Repeat sound switch
    entities.append(RepeatSoundSwitch(coordinator, config_entry))
    
    async_add_entities(entities)


class AlarmEnabledSwitch(CoordinatorEntity, SwitchEntity):
    """Switch to enable/disable the alarm."""

    def __init__(self, coordinator: AlarmClockCoordinator, config_entry: ConfigEntry):
        """Initialize the switch."""
        super().__init__(coordinator)
        self._config_entry = config_entry

    @property
    def name(self) -> str:
        """Return the name of the switch."""
        return f"{self.coordinator.config.get('name', 'Alarm Clock')} Enabled"

    @property
    def unique_id(self) -> str:
        """Return the unique ID."""
        return f"{self.coordinator.unique_id}_{ENTITY_ID_ALARM_ENABLED}"

    @property
    def is_on(self) -> bool:
        """Return true if the alarm is enabled."""
        return self.coordinator.get_alarm_enabled()

    @property
    def icon(self) -> str:
        """Return the icon to use in the frontend."""
        return "mdi:alarm-check" if self.is_on else "mdi:alarm-off"

    @property
    def device_info(self) -> Dict[str, Any]:
        """Return device information."""
        return self.coordinator.device_info

    async def async_turn_on(self, **kwargs: Any) -> None:
        """Turn the alarm on."""
        await self.coordinator.async_set_alarm_enabled(True)

    async def async_turn_off(self, **kwargs: Any) -> None:
        """Turn the alarm off."""
        await self.coordinator.async_set_alarm_enabled(False)


class DayOfWeekSwitch(CoordinatorEntity, SwitchEntity):
    """Switch to enable/disable alarm for a specific day of the week."""

    def __init__(self, coordinator: AlarmClockCoordinator, config_entry: ConfigEntry, day: str):
        """Initialize the switch."""
        super().__init__(coordinator)
        self._config_entry = config_entry
        self._day = day

    @property
    def name(self) -> str:
        """Return the name of the switch."""
        return f"{self.coordinator.config.get('name', 'Alarm Clock')} {self._day.title()}"

    @property
    def unique_id(self) -> str:
        """Return the unique ID."""
        return f"{self.coordinator.unique_id}_{self._day}"

    @property
    def is_on(self) -> bool:
        """Return true if the alarm is enabled for this day."""
        enabled_days = self.coordinator.get_enabled_days()
        return self._day in enabled_days

    @property
    def icon(self) -> str:
        """Return the icon to use in the frontend."""
        return "mdi:calendar-check" if self.is_on else "mdi:calendar-remove"

    @property
    def device_info(self) -> Dict[str, Any]:
        """Return device information."""
        return self.coordinator.device_info

    async def async_turn_on(self, **kwargs: Any) -> None:
        """Enable alarm for this day."""
        enabled_days = self.coordinator.get_enabled_days()
        if self._day not in enabled_days:
            await self.coordinator.async_toggle_day(self._day)

    async def async_turn_off(self, **kwargs: Any) -> None:
        """Disable alarm for this day."""
        enabled_days = self.coordinator.get_enabled_days()
        if self._day in enabled_days:
            await self.coordinator.async_toggle_day(self._day)


class PreAlarmEnabledSwitch(CoordinatorEntity, SwitchEntity):
    """Switch to enable/disable pre-alarm functionality."""

    def __init__(self, coordinator: AlarmClockCoordinator, config_entry: ConfigEntry):
        """Initialize the switch."""
        super().__init__(coordinator)
        self._config_entry = config_entry

    @property
    def name(self) -> str:
        """Return the name of the switch."""
        return f"{self.coordinator.config.get('name', 'Alarm Clock')} Pre-alarm Enabled"

    @property
    def unique_id(self) -> str:
        """Return the unique ID."""
        return f"{self.coordinator.unique_id}_pre_alarm_enabled"

    @property
    def is_on(self) -> bool:
        """Return true if pre-alarm is enabled."""
        return self.coordinator.config.get("pre_alarm_enabled", False)

    @property
    def icon(self) -> str:
        """Return the icon to use in the frontend."""
        return "mdi:alarm-plus" if self.is_on else "mdi:alarm-multiple"

    @property
    def device_info(self) -> Dict[str, Any]:
        """Return device information."""
        return self.coordinator.device_info

    async def async_turn_on(self, **kwargs: Any) -> None:
        """Enable pre-alarm."""
        new_data = {**self._config_entry.data, "pre_alarm_enabled": True}
        self.hass.config_entries.async_update_entry(
            self._config_entry,
            data=new_data
        )
        self.coordinator.config = new_data
        await self.coordinator.async_request_refresh()

    async def async_turn_off(self, **kwargs: Any) -> None:
        """Disable pre-alarm."""
        new_data = {**self._config_entry.data, "pre_alarm_enabled": False}
        self.hass.config_entries.async_update_entry(
            self._config_entry,
            data=new_data
        )
        self.coordinator.config = new_data
        await self.coordinator.async_request_refresh()


class RepeatSoundSwitch(CoordinatorEntity, SwitchEntity):
    """Switch to enable/disable repeat sound functionality."""

    def __init__(self, coordinator: AlarmClockCoordinator, config_entry: ConfigEntry):
        """Initialize the switch."""
        super().__init__(coordinator)
        self._config_entry = config_entry

    @property
    def name(self) -> str:
        """Return the name of the switch."""
        return f"{self.coordinator.config.get('name', 'Alarm Clock')} Repeat Sound"

    @property
    def unique_id(self) -> str:
        """Return the unique ID."""
        return f"{self.coordinator.unique_id}_repeat_sound"

    @property
    def is_on(self) -> bool:
        """Return true if repeat sound is enabled."""
        return self.coordinator.config.get(CONF_REPEAT_SOUND, DEFAULT_REPEAT_SOUND)

    @property
    def icon(self) -> str:
        """Return the icon to use in the frontend."""
        return "mdi:repeat" if self.is_on else "mdi:repeat-off"

    @property
    def entity_category(self):
        """Return the entity category."""
        from homeassistant.helpers.entity import EntityCategory
        return EntityCategory.CONFIG

    @property
    def device_info(self) -> Dict[str, Any]:
        """Return device information."""
        return self.coordinator.device_info

    async def async_turn_on(self, **kwargs: Any) -> None:
        """Enable repeat sound."""
        await self.coordinator.async_set_repeat_sound(True)

    async def async_turn_off(self, **kwargs: Any) -> None:
        """Disable repeat sound."""
        await self.coordinator.async_set_repeat_sound(False)


class PostAlarmEnabledSwitch(CoordinatorEntity, SwitchEntity):
    """Switch to enable/disable post-alarm functionality."""

    def __init__(self, coordinator: AlarmClockCoordinator, config_entry: ConfigEntry):
        """Initialize the switch."""
        super().__init__(coordinator)
        self._config_entry = config_entry

    @property
    def name(self) -> str:
        """Return the name of the switch."""
        return f"{self.coordinator.config.get('name', 'Alarm Clock')} Post-alarm Enabled"

    @property
    def unique_id(self) -> str:
        """Return the unique ID."""
        return f"{self.coordinator.unique_id}_post_alarm_enabled"

    @property
    def is_on(self) -> bool:
        """Return true if post-alarm is enabled."""
        return self.coordinator.config.get("post_alarm_enabled", False)

    @property
    def icon(self) -> str:
        """Return the icon to use in the frontend."""
        return "mdi:alarm-plus" if self.is_on else "mdi:alarm-multiple"

    @property
    def device_info(self) -> Dict[str, Any]:
        """Return device information."""
        return self.coordinator.device_info

    async def async_turn_on(self, **kwargs: Any) -> None:
        """Enable post-alarm."""
        new_data = {**self._config_entry.data, "post_alarm_enabled": True}
        self.hass.config_entries.async_update_entry(
            self._config_entry,
            data=new_data
        )
        self.coordinator.config = new_data
        await self.coordinator.async_request_refresh()

    async def async_turn_off(self, **kwargs: Any) -> None:
        """Disable post-alarm."""
        new_data = {**self._config_entry.data, "post_alarm_enabled": False}
        self.hass.config_entries.async_update_entry(
            self._config_entry,
            data=new_data
        )
        self.coordinator.config = new_data
        await self.coordinator.async_request_refresh()
