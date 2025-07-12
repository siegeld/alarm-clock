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

# Media player configuration keys
CONF_MEDIA_PLAYER_ENTITY = "media_player_entity"
CONF_ALARM_SOUND = "alarm_sound"
CONF_CUSTOM_SOUND_URL = "custom_sound_url"
CONF_ALARM_VOLUME = "alarm_volume"
CONF_REPEAT_SOUND = "repeat_sound"

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

# Built-in alarm sounds
BUILTIN_ALARM_SOUNDS = {
    "classic_beep": {
        "name": "Classic Alarm Beep",
        "url": "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
        "description": "Traditional alarm clock beep"
    },
    "gentle_chime": {
        "name": "Gentle Chime",
        "url": "https://www.soundjay.com/misc/sounds/bell-ringing-01.wav", 
        "description": "Soft bell chime"
    },
    "urgent_beep": {
        "name": "Urgent Beep",
        "url": "https://www.soundjay.com/misc/sounds/beep-07a.wav",
        "description": "More intense beeping"
    },
    "digital_alarm": {
        "name": "Digital Alarm",
        "url": "https://www.soundjay.com/misc/sounds/beep-10.wav",
        "description": "Digital alarm sound"
    },
    "custom": {
        "name": "Custom URL",
        "url": None,
        "description": "Use your own sound URL"
    }
}

# Default values for media player settings
DEFAULT_ALARM_VOLUME = 50
DEFAULT_ALARM_SOUND = "classic_beep"
DEFAULT_REPEAT_SOUND = True
