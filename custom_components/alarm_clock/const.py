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
CONF_REPEAT_INTERVAL = "repeat_interval"

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
SERVICE_TEST_SOUND = "test_sound"

# Update intervals
UPDATE_INTERVAL = timedelta(seconds=30)

# Built-in alarm sounds - using more reliable sources
BUILTIN_ALARM_SOUNDS = {
    "classic_beep": {
        "name": "Classic Alarm Beep",
        "url": "https://www.soundbible.com/grab.php?id=1718&type=wav",
        "description": "Traditional alarm clock beep",
        "content_type": "audio/wav"
    },
    "gentle_chime": {
        "name": "Gentle Chime",
        "url": "https://www.soundbible.com/grab.php?id=1815&type=wav",
        "description": "Soft bell chime",
        "content_type": "audio/wav"
    },
    "urgent_beep": {
        "name": "Urgent Beep",
        "url": "https://www.soundbible.com/grab.php?id=1577&type=wav",
        "description": "More intense beeping",
        "content_type": "audio/wav"
    },
    "digital_alarm": {
        "name": "Digital Alarm",
        "url": "https://www.soundbible.com/grab.php?id=1252&type=wav",
        "description": "Digital alarm sound",
        "content_type": "audio/wav"
    },
    "rooster_crow": {
        "name": "Rooster Crow",
        "url": "https://www.soundbible.com/grab.php?id=1210&type=wav",
        "description": "Natural rooster alarm",
        "content_type": "audio/wav"
    },
    "ship_bell": {
        "name": "Ship Bell",
        "url": "https://www.soundbible.com/grab.php?id=1909&type=wav",
        "description": "Ship bell alarm",
        "content_type": "audio/wav"
    },
    "custom": {
        "name": "Custom URL",
        "url": None,
        "description": "Use your own sound URL",
        "content_type": "audio/wav"
    }
}

# Default values for media player settings
DEFAULT_ALARM_VOLUME = 50
DEFAULT_ALARM_SOUND = "classic_beep"
DEFAULT_REPEAT_SOUND = True
DEFAULT_REPEAT_INTERVAL = 3  # seconds pause after sound completes
DEFAULT_SOUND_DURATION = 3   # estimated seconds for most alarm sounds
