# 🕐 Alarm Clock Integration for Home Assistant

A comprehensive alarm clock integration for Home Assistant that provides powerful alarm clock functionality with entities, services, and automations.

[![hacs][hacsbadge]][hacs]
[![GitHub Release][releases-shield]][releases]
[![License][license-shield]](LICENSE)

## 🌟 What You Get

This integration provides:

- **🔧 Custom Integration** - Complete alarm clock functionality with entities, services, and automations
- **🎨 Companion Card** - Works with the separate [Alarm Clock Card](https://github.com/siegeld/alarm-clock-card) for beautiful UI

## ✨ Features

### Integration Features
- **🗓️ Flexible Scheduling** - Set different alarm times and enable/disable for specific days of the week
- **🎬 Script Integration** - Execute Home Assistant scripts at three different stages:
  - **Pre-alarm**: Run scripts before the alarm (e.g., gradually turn on lights)
  - **Alarm trigger**: Run scripts when the alarm goes off (e.g., play music, announcements)
  - **Post-alarm**: Run scripts after a delay to end the alarm (e.g., turn off music)
- **😴 Smart Snooze** - Configurable snooze duration (1-30 minutes) and maximum snooze count
- **🤖 Auto-Dismiss** - Automatically dismiss alarms after a specified time
- **🎯 Multiple Entities** - Creates time, switch, and sensor entities for full control
- **📊 Rich Status** - Real-time status updates with time until next alarm
- **🌍 Multi-language Support** - Internationalization ready

### Lovelace Card Features
- **⏰ Large Time Display** - Clear, easy-to-read time with next alarm information
- **🎛️ Time Picker** - Intuitive time selection interface
- **🔘 Day Toggles** - Quick enable/disable for each day of the week
- **▶️ Control Buttons** - Snooze and dismiss buttons when alarm is active
- **📋 Script Display** - Shows configured pre/post alarm scripts
- **🎨 Status Animations** - Visual feedback for alarm states
- **⚙️ Card Editor** - GUI configuration in Lovelace editor
- **📱 Mobile Responsive** - Works perfectly on all screen sizes

## 🚀 Installation

### Via HACS (Recommended)

1. Open HACS in your Home Assistant instance
2. Go to **"Integrations"**
3. Click the **"+ Explore & Download Repositories"** button
4. Search for **"Alarm Clock"**
5. Click **"Download"**
6. **Restart Home Assistant**
7. Go to **Settings** → **Devices & Services**
8. Click **"+ Add Integration"** and search for **"Alarm Clock"**
9. Follow the configuration wizard

> **✅ Both Components Installed!** The integration AND the Lovelace card are now available.

### Manual Installation

1. Copy the `custom_components/alarm_clock` folder to your Home Assistant `custom_components` directory
2. Copy the `www/alarm-clock-card/alarm-clock-card.js` file to your `www/alarm-clock-card/` directory
3. Restart Home Assistant
4. Add the card resource:
   - Go to **Settings** → **Dashboards** → **Resources**
   - Click **"+ Add Resource"**
   - URL: `/local/alarm-clock-card/alarm-clock-card.js`
   - Resource type: **JavaScript module**
5. Go to **Settings** → **Devices & Services**
6. Click **"+ Add Integration"** and search for **"Alarm Clock"**
7. Follow the configuration wizard

## ⚙️ Configuration

The integration uses a **GUI configuration flow** with three steps:

### Step 1: Basic Setup
- **Name**: Give your alarm clock a friendly name
- **Default Alarm Time**: Set the initial alarm time (can be changed later)

### Step 2: Script Configuration
- **Pre-alarm Script**: Optional script to run before the alarm
- **Pre-alarm Minutes**: How many minutes before the alarm to run the pre-alarm script (1-60)
- **Alarm Script**: **Required** script to run when the alarm triggers
- **Post-alarm Script**: Optional script to run after the alarm to end it
- **Post-alarm Minutes**: How many minutes after the alarm to run the post-alarm script (1-120)

### Step 3: Advanced Settings
- **Snooze Duration**: How long each snooze lasts (1-30 minutes, default: 9)
- **Maximum Snoozes**: Maximum number of times the alarm can be snoozed (0-10, default: 3)
- **Auto-dismiss Minutes**: Automatically dismiss alarm after this time (5-120 minutes, default: 30)
- **Default Enabled Days**: Which days of the week the alarm is enabled by default

## 🎯 Entities Created

For each alarm clock instance, the following entities are created:

### Primary Entities
- **`alarm_clock.{name}`** - Main alarm clock entity with state (`off`/`armed`/`ringing`/`snoozed`)
- **`time.{name}_alarm_time`** - Set the alarm time

### Switch Entities
- **`switch.{name}_enabled`** - Enable/disable the alarm
- **`switch.{name}_monday`** through **`switch.{name}_sunday`** - Enable/disable for each day
- **`switch.{name}_snooze`** - Snooze control (only available when ringing)

### Sensor Entities
- **`sensor.{name}_next_alarm`** - Shows the next scheduled alarm time
- **`sensor.{name}_status`** - Current alarm status with additional attributes
- **`sensor.{name}_time_until_alarm`** - Time remaining until next alarm (in minutes)

### Number Entities
- **`number.{name}_snooze_duration`** - Adjust snooze duration (1-30 minutes)
- **`number.{name}_max_snoozes`** - Adjust maximum snooze count (0-10)

## 🛠️ Services

The integration provides the following services:

### `alarm_clock.snooze`
Snooze the alarm for the configured duration.

```yaml
service: alarm_clock.snooze
target:
  entity_id: alarm_clock.bedroom_alarm
```

### `alarm_clock.dismiss`
Dismiss the active alarm.

```yaml
service: alarm_clock.dismiss
target:
  entity_id: alarm_clock.bedroom_alarm
```

### `alarm_clock.set_alarm`
Set the alarm time programmatically.

```yaml
service: alarm_clock.set_alarm
target:
  entity_id: alarm_clock.bedroom_alarm
data:
  time: "07:30"
```

### `alarm_clock.toggle_day`
Toggle alarm for a specific day of the week.

```yaml
service: alarm_clock.toggle_day
target:
  entity_id: alarm_clock.bedroom_alarm
data:
  day: "monday"
```

## 🎨 Using the Lovelace Card

For the companion Lovelace card (available separately), after installation add it to your dashboard:

### Basic Configuration
```yaml
type: custom:alarm-clock-card
entity: alarm_clock.bedroom_alarm
```

### Full Configuration
```yaml
type: custom:alarm-clock-card
entity: alarm_clock.bedroom_alarm
name: "Bedroom Alarm"
show_name: true
show_scripts: true
show_days: true
compact: false
theme: auto
```

### Configuration Options
- **`entity`** (*required*): The alarm clock entity
- **`name`** (*optional*): Custom name for the card
- **`show_name`** (*optional*): Show/hide the card name (default: `true`)
- **`show_scripts`** (*optional*): Show/hide script information (default: `true`)
- **`show_days`** (*optional*): Show/hide day toggles (default: `true`)
- **`compact`** (*optional*): Use compact layout (default: `false`)
- **`theme`** (*optional*): Theme mode (`auto`, `light`, `dark`, default: `auto`)

### Card Features
- **⏰ Large Time Display** - Shows current alarm time with next alarm info
- **🎛️ Interactive Time Picker** - Tap to adjust alarm time
- **🔘 Day Toggles** - Quick enable/disable for each day
- **▶️ Control Buttons** - Snooze and dismiss when alarm is active
- **📊 Status Indicators** - Visual feedback for alarm states
- **📋 Script Information** - Shows configured automation scripts

## 🎬 Example Automation Scripts

### Pre-alarm Script (Gradual Light Wake-up)
```yaml
alias: "Bedroom Wake Up Lights"
description: "Gradually brighten lights 15 minutes before alarm"
sequence:
  - service: light.turn_on
    target:
      entity_id: light.bedroom_lights
    data:
      brightness: 1
      color_temp: 500
  - repeat:
      count: 15
      sequence:
        - delay: '00:01:00'
        - service: light.turn_on
          target:
            entity_id: light.bedroom_lights
          data:
            brightness: "{{ (repeat.index * 17) | int }}"
            color_temp: "{{ (500 - (repeat.index * 20)) | int }}"
mode: single
```

### Alarm Script (Play Music & Announcements)
```yaml
alias: "Morning Alarm Sound"
description: "Play music and make announcements"
sequence:
  - service: media_player.volume_set
    target:
      entity_id: media_player.bedroom_speaker
    data:
      volume_level: 0.1
  - service: media_player.play_media
    target:
      entity_id: media_player.bedroom_speaker
    data:
      media_content_id: "https://example.com/gentle-alarm.mp3"
      media_content_type: "audio/mpeg"
  - delay: '00:00:30'
  - service: tts.speak
    target:
      entity_id: tts.google_en
    data:
      entity_id: media_player.bedroom_speaker
      message: "Good morning! Today is {{ now().strftime('%A, %B %d') }}. The weather is {{ states('sensor.weather_temperature') }} degrees."
  - repeat:
      count: 10
      sequence:
        - delay: '00:00:30'
        - service: media_player.volume_set
          target:
            entity_id: media_player.bedroom_speaker
          data:
            volume_level: "{{ (0.1 + (repeat.index * 0.05)) | round(2) }}"
mode: single
```

### Post-alarm Script (Cleanup)
```yaml
alias: "End Morning Alarm"
description: "Clean up after alarm dismissal"
sequence:
  - service: media_player.media_stop
    target:
      entity_id: media_player.bedroom_speaker
  - service: light.turn_on
    target:
      entity_id: light.bedroom_lights
    data:
      brightness: 255
      color_temp: 250
  - delay: '00:10:00'
  - service: light.turn_off
    target:
      entity_id: light.bedroom_lights
    data:
      transition: 300
mode: single
```

## 🔍 Advanced Usage

### Multiple Alarm Clocks
You can create multiple alarm clock instances for different rooms or purposes:

```yaml
# Configuration for bedroom alarm
- platform: alarm_clock
  name: "Bedroom Alarm"
  
# Configuration for kitchen alarm  
- platform: alarm_clock
  name: "Kitchen Alarm"
```

### Automation Examples

#### Disable alarm on weekends
```yaml
automation:
  - alias: "Disable Bedroom Alarm on Weekends"
    trigger:
      - platform: time
        at: "23:00:00"
    condition:
      - condition: time
        weekday:
          - fri
    action:
      - service: switch.turn_off
        target:
          entity_id: 
            - switch.bedroom_alarm_saturday
            - switch.bedroom_alarm_sunday
```

#### Enable alarm for work days
```yaml
automation:
  - alias: "Enable Bedroom Alarm for Work Week"
    trigger:
      - platform: time
        at: "21:00:00"
    condition:
      - condition: time
        weekday:
          - sun
    action:
      - service: switch.turn_on
        target:
          entity_id: 
            - switch.bedroom_alarm_monday
            - switch.bedroom_alarm_tuesday
            - switch.bedroom_alarm_wednesday
            - switch.bedroom_alarm_thursday
            - switch.bedroom_alarm_friday
```

## 🔧 Troubleshooting

### Integration Issues

#### Alarm Not Triggering
1. **Check alarm enabled**: Ensure `switch.{name}_enabled` is on
2. **Verify day settings**: At least one day must be enabled
3. **Confirm alarm time**: Check `time.{name}_alarm_time` is set correctly
4. **Script validation**: Ensure the alarm script exists and is valid
5. **Check logs**: Look for errors in Home Assistant logs

#### Script Errors
1. **Entity verification**: Confirm all entity IDs in scripts are correct
2. **Script testing**: Test scripts manually to ensure they work
3. **Permission check**: Ensure scripts have proper permissions
4. **Log analysis**: Check Home Assistant logs for script execution errors

### Card Issues

#### Card Not Loading
1. **Resource registration**: Ensure card is registered in dashboard resources
2. **File path**: Verify `/local/alarm-clock-card.js` exists and is accessible
3. **Browser cache**: Clear browser cache and hard refresh (Ctrl+F5)
4. **Console errors**: Check browser developer console for errors

#### Card Not Responding
1. **Entity check**: Ensure the alarm clock entity exists and is available
2. **WebSocket connection**: Check Home Assistant WebSocket connection
3. **Browser compatibility**: Ensure using a modern browser
4. **Card configuration**: Verify card YAML configuration is correct

### Common Issues

#### Time Zone Problems
- Ensure Home Assistant time zone is configured correctly
- Check that alarm times account for daylight saving time changes

#### Performance Issues
- Limit the number of alarm clock instances (recommended: ≤ 5)
- Optimize scripts to avoid long-running operations

#### State Synchronization
- If entities get out of sync, restart Home Assistant
- Check for conflicting automations that might interfere

## 🛠️ Development

### Building the Lovelace Card

Requirements:
- Node.js 16 or higher
- npm or yarn

```bash
# Install dependencies
cd ui
npm install

# Development build (with watch)
npm run dev

# Production build
npm run build

# Lint code
npm run lint

# Format code
npm run format
```

### Project Structure
```
alarm-clock/
├── custom_components/alarm_clock/    # Integration files
│   ├── __init__.py                   # Integration setup
│   ├── alarm_clock.py               # Main alarm clock logic
│   ├── config_flow.py               # Configuration flow
│   ├── const.py                     # Constants
│   ├── manifest.json                # Integration manifest
│   └── services.yaml                # Service definitions
├── ui/                              # Lovelace card source
│   ├── dist/                        # Built files
│   ├── *.ts                         # TypeScript source files
│   ├── package.json                 # Dependencies
│   └── webpack.config.js            # Build configuration
├── hacs.json                        # HACS configuration
└── README.md                        # This file
```

### Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

### Testing

```bash
# Test the integration
pytest tests/

# Test the card
cd ui
npm test

# Type checking
npm run type-check
```

## 📋 Version Compatibility

- **Home Assistant**: 2023.1.0 or higher
- **HACS**: 1.6.0 or higher
- **Python**: 3.9 or higher
- **Node.js**: 16 or higher (for development)

## 🤝 Support

- **🐛 Bug Reports**: [GitHub Issues](https://github.com/your-username/alarm-clock/issues)
- **💡 Feature Requests**: [GitHub Discussions](https://github.com/your-username/alarm-clock/discussions)
- **💬 Community**: [Home Assistant Community](https://community.home-assistant.io/)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🏆 Acknowledgments

- Home Assistant community for inspiration and support
- HACS for making installation seamless
- All contributors who help improve this integration

---

**⭐ If you like this integration, please star the repository!**

[hacs]: https://github.com/hacs/integration
[hacsbadge]: https://img.shields.io/badge/HACS-Custom-orange.svg
[releases-shield]: https://img.shields.io/github/release/your-username/alarm-clock.svg
[releases]: https://github.com/your-username/alarm-clock/releases
[license-shield]: https://img.shields.io/github/license/your-username/alarm-clock.svg
