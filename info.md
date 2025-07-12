# Alarm Clock Integration

A comprehensive alarm clock integration for Home Assistant with advanced scheduling and script execution capabilities.

## Key Features

- **Complete Alarm System**: Full-featured alarm clock with time setting, enable/disable, and day-of-week scheduling
- **Voice Control**: Complete voice control using Home Assistant Voice Preview with room-specific targeting
- **Three-Stage Script Execution**: 
  - Pre-alarm scripts (gradual wake-up)
  - Alarm trigger scripts (sound/music)
  - Post-alarm scripts (automatic shutoff)
- **Smart Snooze**: Configurable snooze duration and maximum snooze count
- **Beautiful UI**: Custom Lovelace card with intuitive controls
- **Easy Configuration**: GUI-based setup with script selection dropdowns

## Perfect For

- **Smart Wake-up Routines**: Gradually turn on lights before alarm time
- **Multi-room Audio**: Trigger announcements or music across your home
- **Automated Shutoff**: Automatically stop alarms after a set time
- **Flexible Scheduling**: Different settings for weekdays vs weekends

## What Gets Created

Each alarm clock creates multiple entities:
- Main alarm clock entity with status
- Time entity for setting alarm time
- Switches for enable/disable and each day of week
- Sensors for next alarm time and countdown
- Services for snooze, dismiss, and automation

## Quick Setup

1. Install via HACS
2. Add integration in Home Assistant
3. Configure alarm name and default time
4. Select your scripts for each alarm stage
5. Set snooze preferences and default days
6. Add the custom card to your dashboard

## Example Use Cases

- **Gentle Wake-up**: Pre-alarm gradually brightens bedroom lights over 15 minutes
- **Morning Routine**: Alarm triggers coffee maker and plays morning playlist
- **Smart Shutoff**: Post-alarm turns off music after 30 minutes if not dismissed
- **Weekend Sleep-in**: Different schedules for weekdays vs weekends
- **Voice Control**: "Set alarm for 7:30 AM", "Turn on alarm", "Snooze", "What time is my alarm?"
- **Room-Specific Voice**: Commands automatically target the alarm clock in the current room
