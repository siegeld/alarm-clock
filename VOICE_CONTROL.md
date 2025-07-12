# Voice Control for Alarm Clock Integration

This document describes how to use voice commands with the Alarm Clock integration using Home Assistant Voice Preview.

## Overview

The Alarm Clock integration now supports comprehensive voice control through Home Assistant Voice Preview. You can set alarms, enable/disable them, snooze, dismiss, and query alarm status using natural language commands.

## Features

- **Room-Specific Voice Control**: Commands automatically target the alarm clock in the room where the voice command is issued
- **Natural Language Processing**: Supports various ways to express times and commands
- **Comprehensive Command Set**: Set, enable, disable, snooze, dismiss, and query alarms
- **Day Management**: Enable/disable alarms for specific days of the week
- **Confirmation Responses**: Voice assistant provides confirmation of actions taken

## Setup

### Prerequisites

1. Home Assistant with Voice Preview enabled
2. Alarm Clock integration installed and configured
3. Voice assistant device (like Echo, Google Home, or Home Assistant's built-in assistant)

### Configuration

1. **Install the Integration**: Add the Alarm Clock integration to your Home Assistant instance
2. **Configure Alarm Clocks**: Set up alarm clocks in different rooms/areas
3. **Assign to Areas**: Make sure each alarm clock device is assigned to the correct area/room in Home Assistant
4. **Enable Voice Preview**: Ensure Home Assistant Voice Preview is enabled and configured

## Voice Commands

### Setting Alarm Time

Set the alarm to a specific time:
- "Set alarm for 7:30 AM"
- "Set my alarm for seven thirty"
- "Wake me up at 6:00 AM"
- "I need to wake up at 8:15"
- "Set bedroom alarm for 7:30 AM" (room-specific)

**Supported Time Formats:**
- `7:30`, `07:30`
- `7:30 AM`, `7:30 PM`
- `seven thirty`, `seven thirty AM`
- `6:00 in the morning`
- `8:00 at night`

### Enabling/Disabling Alarms

Turn alarms on or off:
- "Turn on alarm"
- "Enable my alarm"
- "Turn off alarm"
- "Disable the alarm"
- "Turn on bedroom alarm" (room-specific)

### Snoozing and Dismissing

Control active alarms:
- "Snooze"
- "Snooze alarm"
- "Dismiss alarm"
- "Stop alarm"
- "Turn off alarm"

### Alarm Status Queries

Check alarm settings:
- "What time is my alarm?"
- "When is my alarm?"
- "Is my alarm on?"
- "Alarm status"
- "What time is bedroom alarm?" (room-specific)

### Day Management

Enable/disable alarms for specific days:
- "Turn on alarm for Monday"
- "Enable alarm for weekdays"
- "Turn off alarm for Saturday"
- "Disable alarm for Sunday"

**Supported Days:**
- Individual days: `monday`, `tuesday`, `wednesday`, `thursday`, `friday`, `saturday`, `sunday`
- Special groups: `weekdays`, `weekends`

## Room-Specific Targeting

The voice commands automatically target the alarm clock in the room where the command is issued. For example:

- If you say "Set alarm for 7:30 AM" in the bedroom, it will set the bedroom alarm clock
- If you say "Turn on alarm" in the kitchen, it will enable the kitchen alarm clock

You can also explicitly specify the room:
- "Set bedroom alarm for 7:30 AM"
- "Turn on living room alarm"
- "What time is office alarm?"

## Example Usage Scenarios

### Morning Routine Setup
```
User: "Set alarm for 6:30 AM"
Assistant: "Alarm set for 6:30 am"

User: "Turn on alarm for weekdays"
Assistant: "Alarm enabled for weekdays"
```

### Alarm Management
```
User: "What time is my alarm?"
Assistant: "Your alarm is set for 6:30 am and is currently enabled"

User: "Turn off alarm for Saturday"
Assistant: "Alarm disabled for Saturday"
```

### During Alarm
```
User: "Snooze"
Assistant: "Alarm snoozed for 9 minutes"

User: "Stop alarm"
Assistant: "Alarm dismissed"
```

## Multiple Alarm Clocks

If you have multiple alarm clocks in different rooms:

1. **Automatic Room Detection**: Commands issued in each room will target that room's alarm clock
2. **Explicit Room Targeting**: Use room names in commands like "Set bedroom alarm for 7:30 AM"
3. **Fallback**: If no room-specific alarm is found, commands will target the first available alarm clock

## Troubleshooting

### Common Issues

**"I couldn't find an alarm clock"**
- Ensure the alarm clock integration is installed and configured
- Check that the alarm clock device is assigned to the correct area/room
- Verify that the voice assistant device is also assigned to the same area

**"I couldn't understand that time"**
- Try different time formats (e.g., "7:30 AM" instead of "seven thirty")
- Ensure clear pronunciation of numbers and AM/PM
- Use 24-hour format if needed (e.g., "19:30" for 7:30 PM)

**Commands not working**
- Check that Home Assistant Voice Preview is enabled and working
- Verify that the conversation integration is loaded
- Check Home Assistant logs for error messages

### Debugging

Enable debug logging for the alarm clock integration:

```yaml
logger:
  default: info
  logs:
    custom_components.alarm_clock: debug
```

## Advanced Configuration

### Custom Voice Commands

You can extend the voice commands by modifying the `intents.yaml` file:

```yaml
# Add custom sentences
AlarmSetTime:
  data:
    - sentences:
        - "schedule alarm for {time}"
        - "wake me at {time}"
```

### Integration with Automations

Voice commands can be combined with Home Assistant automations:

```yaml
automation:
  - alias: "Voice Alarm Set Notification"
    trigger:
      platform: state
      entity_id: time.bedroom_alarm_clock_time
    action:
      service: notify.mobile_app
      data:
        message: "Alarm set for {{ states('time.bedroom_alarm_clock_time') }}"
```

## Supported Languages

Currently, the voice commands are available in English. Additional languages can be added by creating localized `intents.yaml` files.

## Future Enhancements

Planned features for future releases:
- Support for multiple alarms per room
- Recurring alarm patterns
- Integration with calendar events
- Smart alarm timing based on sleep cycles
- Additional language support

## Support

For issues or questions:
1. Check the Home Assistant logs for error messages
2. Ensure all prerequisites are met
3. Verify room/area assignments
4. Report issues through the integration's issue tracker
