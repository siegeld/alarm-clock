# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2025-07-09

### 🛠️ Bug Fixes & Improvements

#### Frontend Card Fixes
- **Fixed Status Indicator** - Correctly maps to `switch.alarm_clock_enabled` instead of wrong entity
- **Fixed Day Button Updates** - Real-time state changes without requiring browser refresh
- **Enhanced Entity Discovery** - Improved entity mapping logic to prevent conflicts

#### User Experience Improvements
- **12-Hour Time Format** - Display now shows "8:25 PM" instead of "20:25" for better readability
- **Immediate Visual Feedback** - All button clicks now provide instant visual responses
- **Cleaner Interface** - Removed debug logging for production use

#### Backend Synchronization
- **Fixed State Sync** - Resolved switch/main entity synchronization issues
- **Improved State Logic** - Always updates state when alarm enabled/disabled changes
- **Better Error Handling** - Enhanced entity communication reliability

### ✨ Technical Improvements

#### State Management
- **Enhanced Reactivity** - Improved Lit element change detection for nested objects
- **Fresh State Reading** - Card now reads directly from `hass.states` for real-time data
- **Forced Refresh Logic** - Added manual refresh triggers for immediate updates

#### Code Quality
- **Removed Debug Code** - Cleaned up console logging from troubleshooting
- **Better Error Messages** - More descriptive error handling and logging
- **Version Consistency** - Updated both manifest and UI card to 1.1.0

### 🎯 What's Fixed

- ✅ Status correctly shows "ARMED" when enabled, "OFF" when disabled
- ✅ Time displays in user-friendly 12-hour format (e.g., "8:25 PM")
- ✅ Day buttons update immediately when clicked
- ✅ Enable/disable button works properly without refresh
- ✅ Real-time entity state synchronization across all components

### 🔧 Breaking Changes

None - this is a backwards-compatible bug fix release.

### 📝 Migration Notes

- Hard refresh your browser (Ctrl+F5) after updating to see the fixes
- No configuration changes required
- All existing alarm settings will be preserved

---

## [1.0.0] - 2025-07-08

### 🎉 Initial Release

This is the first stable release of the Alarm Clock integration for Home Assistant.

### ✨ Features

#### Core Alarm Functionality
- **Comprehensive Alarm Clock** - Full-featured alarm with time, day selection, and enable/disable
- **Multi-Day Support** - Configure alarm for any combination of weekdays
- **State Persistence** - All settings survive Home Assistant restarts
- **Real-Time Updates** - Live countdown and status updates

#### Script Integration
- **Pre-Alarm Scripts** - Execute actions X minutes before alarm (e.g., gradual wake-up lighting)
- **Main Alarm Scripts** - Execute alarm sound/notification actions
- **Post-Alarm Scripts** - Execute cleanup actions (e.g., turn off lights, start coffee)
- **Independent Post-Alarm** - Runs on separate timer regardless of how alarm ends

#### Snooze System
- **Smart Snooze** - Configurable duration (1-30 minutes, default 9)
- **Snooze Limits** - Configurable max snoozes (1-10, default 3)
- **Snooze Tracking** - Shows current snooze count and remaining snoozes
- **Snooze Countdown** - Real-time countdown until alarm rings again

#### Auto-Dismiss
- **Configurable Timeout** - Auto-dismiss after 1-120 minutes (default 30)
- **Safety Feature** - Prevents alarm from ringing forever if user is away
- **Independent Operation** - Works alongside manual dismiss and snooze

#### User Interface
- **Always-Available Buttons** - Snooze and dismiss buttons never greyed out
- **Smart Actions** - Buttons work when appropriate, do nothing gracefully when not
- **Time Picker** - Easy alarm time setting with immediate feedback
- **Day Toggles** - Individual switches for each day of the week

#### Real-Time Sensors
- **Time Until Alarm** - Live countdown with 1-second precision
- **Smart Countdown** - Shows snooze countdown when snoozed, alarm countdown when armed
- **Next Alarm** - Shows exact date/time of next alarm
- **Alarm Status** - Current state (off/armed/ringing/snoozed) with rich attributes

#### Configuration Entities
- **Pre-Alarm Minutes** - How long before alarm to run pre-alarm script (1-60 min)
- **Post-Alarm Minutes** - How long after alarm to run post-alarm script (1-120 min)
- **Snooze Duration** - How long each snooze lasts (1-30 min)
- **Max Snoozes** - Maximum number of snoozes allowed (1-10)
- **Auto Dismiss Minutes** - How long alarm rings before auto-dismiss (1-120 min)

### 🔧 Technical Features

#### Entity Types
- **Main Alarm Clock** - Core entity with comprehensive state management
- **Time Entity** - For setting alarm time via time picker
- **Switch Entities** - For enabling/disabling alarm and individual days
- **Number Entities** - For configuring durations and limits
- **Button Entities** - For snooze and dismiss actions
- **Sensor Entities** - For status, countdown, and next alarm information

#### State Management
- **Persistent Configuration** - All settings saved to Home Assistant config
- **Startup State Restoration** - Correctly restores alarm time, enabled state, and day selection
- **Execution Tracking** - Prevents duplicate script execution
- **Timer Management** - Comprehensive timer system with proper cleanup

#### Events & Logging
- **Rich Event System** - Fires events for alarm triggered, snoozed, dismissed, auto-dismissed
- **Comprehensive Logging** - Debug-level logging for troubleshooting
- **Logbook Integration** - Events appear in Home Assistant logbook
- **State Attributes** - Rich attributes for automations and dashboards

### 🎯 Use Cases

#### Basic Alarm
- Set wake-up time and days
- Choose alarm sound script
- Snooze or dismiss when ringing

#### Advanced Wake-Up
- Pre-alarm: Gradually brighten lights 15 minutes before
- Main alarm: Play wake-up sounds and notifications
- Post-alarm: Turn off lights, start coffee maker after 30 minutes

#### Safety Features
- Auto-dismiss prevents infinite ringing
- Configurable snooze limits prevent oversleeping
- Always-available controls ensure alarm can always be stopped

### 📱 Dashboard Integration

#### Entities for Cards
- `sensor.alarm_clock_time_until_alarm` - Real-time countdown
- `sensor.alarm_clock_next_alarm` - Next alarm timestamp
- `sensor.alarm_clock_status` - Current state with rich attributes
- `time.alarm_clock_time` - Time picker for setting alarm
- `button.alarm_clock_snooze` - Manual snooze action
- `button.alarm_clock_dismiss` - Manual dismiss action

#### Automation Examples
```yaml
# Bedtime automation when alarm is set for tomorrow
- trigger:
    platform: numeric_state
    entity_id: sensor.alarm_clock_time_until_alarm
    below: 480  # 8 hours
  action:
    service: light.turn_off
    entity_id: all

# Pre-coffee automation
- trigger:
    platform: event
    event_type: alarm_clock_triggered
  action:
    service: switch.turn_on
    entity_id: switch.coffee_maker
```

### 🚀 Installation

1. Copy the `custom_components/alarm_clock` folder to your Home Assistant custom_components directory
2. Restart Home Assistant
3. Go to Settings > Integrations > Add Integration
4. Search for "Alarm Clock" and follow the setup wizard
5. Configure your alarm scripts and preferences

### 📋 Requirements

- Home Assistant 2023.4.0 or later
- Python 3.11 or later
- Script entities for alarm sounds/actions (optional)

### 🎉 Initial Release Notes

This initial release provides a complete, production-ready alarm clock solution for Home Assistant. All core functionality is implemented and tested, including state persistence, real-time updates, and comprehensive configuration options.

The integration is designed to be both simple for basic use cases and powerful for advanced automation scenarios.

---

**Full Changelog**: https://github.com/your-repo/alarm-clock/commits/v1.0.0
