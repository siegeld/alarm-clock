"""Constants for the Alarm Clock integration."""
from datetime import timedelta

DOMAIN = "alarm_clock"

# Default values
DEFAULT_NAME = "Alarm Clock"
DEFAULT_SNOOZE_DURATION = 9  # minutes
DEFAULT_MAX_SNOOZES = 3
DEFAULT_PRE_ALARM_MINUTES = 15
DEFAULT_POST_ALARM_MINUTES = 30
DEFAULT_AUTO_DISMISS_MINUTES = 30

# Configuration keys
CONF_PRE_ALARM_ENABLED = "pre_alarm_enabled"
CONF_PRE_ALARM_SCRIPT = "pre_alarm_script"
CONF_PRE_ALARM_MINUTES = "pre_alarm_minutes"
CONF_ALARM_SCRIPT = "alarm_script"
CONF_POST_ALARM_ENABLED = "post_alarm_enabled"
CONF_POST_ALARM_SCRIPT = "post_alarm_script"
CONF_POST_ALARM_MINUTES = "post_alarm_minutes"
CONF_SNOOZE_DURATION = "snooze_duration"
CONF_MAX_SNOOZES = "max_snoozes"
CONF_AUTO_DISMISS_MINUTES = "auto_dismiss_minutes"
CONF_DEFAULT_ENABLED_DAYS = "default_enabled_days"

# Alarm states
ALARM_STATE_OFF = "off"
ALARM_STATE_ARMED = "armed"
ALARM_STATE_RINGING = "ringing"
ALARM_STATE_SNOOZED = "snoozed"

# Days of week
DAYS_OF_WEEK = [
    "monday",
    "tuesday", 
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday"
]

# Entity IDs
ENTITY_ID_ALARM_CLOCK = "alarm_clock"
ENTITY_ID_ALARM_TIME = "alarm_time"
ENTITY_ID_ALARM_ENABLED = "alarm_enabled"
ENTITY_ID_SNOOZE = "snooze"
ENTITY_ID_NEXT_ALARM = "next_alarm"
ENTITY_ID_ALARM_STATUS = "alarm_status"
ENTITY_ID_TIME_UNTIL_ALARM = "time_until_alarm"

# Services
SERVICE_SNOOZE = "snooze"
SERVICE_DISMISS = "dismiss"
SERVICE_SET_ALARM = "set_alarm"
SERVICE_TOGGLE_DAY = "toggle_day"

# Update intervals
UPDATE_INTERVAL = timedelta(seconds=30)
