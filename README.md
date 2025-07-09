# Alarm Clock Integration for Home Assistant

A comprehensive alarm clock integration for Home Assistant that provides advanced scheduling, script execution, and snooze functionality.

## Features

- **Flexible Scheduling**: Set different alarm times and enable/disable for specific days of the week
- **Script Integration**: Execute Home Assistant scripts at three different stages:
  - Pre-alarm: Run scripts before the alarm (e.g., gradually turn on lights)
  - Alarm trigger: Run scripts when the alarm goes off (e.g., play music, announcements)
  - Post-alarm: Run scripts after a delay to end the alarm (e.g., turn off music)
- **Snooze Functionality**: Configurable snooze duration and maximum snooze count
- **Multiple Entities**: Creates time, switch, and sensor entities for full control
- **Beautiful UI**: Custom Lovelace card for easy control and monitoring
- **HACS Compatible**: Easy installation through the Home Assistant Community Store

## Installation

### Via HACS (Recommended)

1. Open HACS in your Home Assistant instance
2. Go to "Integrations"
3. Click the "+" button
4. Search for "Alarm Clock"
5. Click "Install"
6. Restart Home Assistant
7. Go to Configuration → Integrations
8. Click "+" and search for "Alarm Clock"
9. Follow the configuration wizard

### Manual Installation

1. Copy the `custom_components/alarm_clock` folder to your Home Assistant `custom_components` directory
2. Copy the `ui` folder to your `www` directory (create it if it doesn't exist)
3. Restart Home Assistant
4. Go to Configuration → Integrations
5. Click "+" and search for "Alarm Clock"
6. Follow the configuration wizard

## Configuration

The integration uses a GUI configuration flow with three steps:

### Step 1: Basic Setup
- **Name**: Give your alarm clock a friendly name
- **Default Alarm Time**: Set the initial alarm time (can be changed later)

### Step 2: Script Configuration
- **Pre-alarm Script**: Optional script to run before the alarm
- **Pre-alarm Minutes**: How many minutes before the alarm to run the pre-alarm script
- **Alarm Script**: Required script to run when the alarm triggers
- **Post-alarm Script**: Optional script to run after the alarm to end it
- **Post-alarm Minutes**: How many minutes after the alarm to run the post-alarm script

### Step 3: Advanced Settings
- **Snooze Duration**: How long each snooze lasts (1-30 minutes)
- **Maximum Snoozes**: Maximum number of times the alarm can be snoozed
- **Default Enabled Days**: Which days of the week the alarm is enabled by default

## Entities Created

For each alarm clock instance, the following entities are created:

### Main Entity
- `alarm_clock.{name}` - Main alarm clock entity with state (off/armed/ringing/snoozed)

### Time Entity
- `time.{name}_alarm_time` - Set the alarm time

### Switch Entities
- `switch.{name}_enabled` - Enable/disable the alarm
- `switch.{name}_monday` through `switch.{name}_sunday` - Enable/disable for each day
- `switch.{name}_snooze` - Snooze control (only available when ringing)

### Sensor Entities
- `sensor.{name}_next_alarm` - Shows the next scheduled alarm time
- `sensor.{name}_status` - Current alarm status with additional attributes
- `sensor.{name}_time_until_alarm` - Time remaining until next alarm (in minutes)

## Services

The integration provides the following services:

### `alarm_clock.snooze`
Snooze the alarm for the configured duration.

### `alarm_clock.dismiss`
Dismiss the active alarm.

### `alarm_clock.set_alarm`
Set the alarm time programmatically.

### `alarm_clock.toggle_day`
Toggle alarm for a specific day of the week.

## Using the Lovelace Card

The integration includes a beautiful custom Lovelace card:

1. Add the card to your dashboard
2. Configure it with your alarm clock entity:

```yaml
type: custom:alarm-clock-card
entity: alarm_clock.bedroom_alarm
name: Bedroom Alarm
```

The card provides:
- Large time display with next alarm information
- Time picker for easy alarm time adjustment
- Enable/disable toggle
- Day-of-week toggles
- Snooze and dismiss buttons (when alarm is ringing)
- Script configuration display
- Status indicators with animations

## Example Automation Scripts

### Pre-alarm Script (Gradual Light Wake-up)
```yaml
alias: "Wake Up Lights"
sequence:
  - service: light.turn_on
    target:
      entity_id: light.bedroom_lights
    data:
      brightness: 1
  - repeat:
      count: 15
      sequence:
        - delay: '00:01:00'
        - service: light.turn_on
          target:
            entity_id: light.bedroom_lights
          data:
            brightness: "{{ repeat.index * 17 }}"
```

### Alarm Script (Play Music)
```yaml
alias: "Morning Alarm"
sequence:
  - service: media_player.play_media
    target:
      entity_id: media_player.bedroom_speaker
    data:
      media_content_id: "https://example.com/alarm-sound.mp3"
      media_content_type: "audio/mpeg"
  - service: media_player.volume_set
    target:
      entity_id: media_player.bedroom_speaker
    data:
      volume_level: 0.3
```

### Post-alarm Script (Turn Off Music)
```yaml
alias: "End Alarm"
sequence:
  - service: media_player.media_stop
    target:
      entity_id: media_player.bedroom_speaker
  - service: light.turn_off
    target:
      entity_id: light.bedroom_lights
```

## Troubleshooting

### Alarm Not Triggering
1. Check that the alarm is enabled (`switch.{name}_enabled` is on)
2. Verify at least one day is enabled
3. Ensure the alarm time is set correctly
4. Check that the alarm script exists and is working

### Script Errors
1. Verify script entity IDs are correct
2. Check Home Assistant logs for script execution errors
3. Test scripts manually to ensure they work

### UI Issues
1. Clear browser cache
2. Ensure the custom card is properly loaded
3. Check browser developer console for errors

## Support

For issues and feature requests, please visit the [GitHub repository](https://github.com/your-username/alarm-clock).

## License

This project is licensed under the MIT License - see the LICENSE file for details.
