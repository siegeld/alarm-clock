# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.4.2] - 2025-01-12

### Added
- **Configurable Repeat Interval**: New number entity to control how often alarm sound repeats
- **Faster Default Repeat**: Changed default repeat interval from 10 seconds to 2 seconds
- **Real-time Configuration**: Repeat interval can be changed via UI without restart
- **Enhanced Configuration Flow**: Repeat interval setting added to setup wizard

### Changed
- **Improved Responsiveness**: Alarm sounds now repeat every 2 seconds by default instead of 10 seconds
- **Dynamic Repeat Control**: Repeat interval is now configurable from 1-60 seconds via `number.{name}_repeat_interval` entity
- **Better User Experience**: More responsive alarm repetition for heavy sleepers

### Technical Details
- Added `CONF_REPEAT_INTERVAL` configuration key with `DEFAULT_REPEAT_INTERVAL = 2`
- New `RepeatIntervalNumber` entity in CONFIG category for device settings
- Enhanced `async_set_repeat_interval()` coordinator method for real-time updates
- Updated sound repetition logic to use configurable interval from configuration
- Added repeat interval to configuration flow with 1-60 second range

### What's New
- ✅ **Configurable repeat timing**: Set any interval from 1-60 seconds
- ✅ **Faster default response**: 2-second repeat instead of 10 seconds
- ✅ **Real-time updates**: Changes take effect immediately without restart
- ✅ **UI integration**: Available in Settings > Devices & Services > Alarm Clock > Configure
- ✅ **Backward compatible**: Existing alarms automatically use new 2-second default

---

## [2.4.1] - 2025-01-12

### Fixed
- **CRITICAL**: Fixed alarm sound not working for existing alarms created before v2.4.0
- **Enhanced fallback logic**: Alarms without sound configuration now automatically use "classic_beep" as default
- **Debug logging cleanup**: Removed excessive debug logging that was spamming logs every second
- **Proper log levels**: Changed setup logs from ERROR to appropriate DEBUG/INFO levels

### Technical Details
- Enhanced `_get_alarm_sound_url()` with intelligent fallbacks for legacy alarms
- Automatic default sound assignment for alarms missing sound configuration
- Informative logging when fallbacks are used ("No alarm sound configured, using default: classic_beep")
- Removed forced debug logging setup that was causing log spam
- Clean production logging with appropriate log levels

### What's Fixed
- ✅ Existing alarms now play sound automatically (no reconfiguration needed)
- ✅ Clean logs without debug spam from coordinator updates
- ✅ Backward compatibility with all existing alarm configurations
- ✅ Production-ready logging levels

---

## [2.4.0] - 2025-01-12

### Added
- New `test_sound` service to test alarm sound configuration
- Sound repetition system - alarm now repeats every 10 seconds until dismissed
- Enhanced logging and diagnostics for media player operations
- Content type detection for different audio file formats (.mp3, .wav, .ogg, .flac, .m4a)
- New built-in alarm sounds: Rooster Crow, Ship Bell
- Event firing for automation integration (sound_started, sound_stopped, sound_error, test_sound events)
- Comprehensive error handling for media player operations
- Media player existence validation before attempting playback

### Changed
- **BREAKING**: Updated all built-in alarm sound URLs to use more reliable sources (soundbible.com)
- Enhanced media player handling with proper content type detection
- Improved error handling and logging throughout media player operations
- Updated services.yaml with proper service definitions for Home Assistant UI

### Fixed
- **MAJOR**: Fixed alarm sound not playing through media player
- Fixed hardcoded media content type issue
- Fixed missing sound repetition functionality
- Fixed poor error handling in media player operations
- Fixed volume setting errors not being properly handled

### Technical Details
- Media player state is now logged for debugging
- Volume setting is handled separately with individual error handling
- Sound repetition uses async timers that respect alarm state
- Enhanced event system for better automation integration
- Comprehensive logging at INFO, DEBUG, and ERROR levels

## [2.3.2] - 2025-07-12

### ✨ User Experience Enhancement: Entity Organization

#### Controls vs Configuration Separation
- **Reorganized Entity Categories** - Clear separation between daily-use controls and setup-once configuration
- **Cleaner Dashboard** - Only frequently-used controls appear on main dashboard
- **Configuration Tab** - All setup options organized in device configuration section
- **Logical Grouping** - Related settings grouped together for better user experience

#### Entity Categorization
- **Controls (Main Dashboard)** - Time setting, enable/disable, day toggles, snooze/dismiss buttons, status sensors
- **Configuration (Device Settings)** - Sound settings, timing settings, script settings
- **Proper Categories** - All configuration entities properly marked with `EntityCategory.CONFIG`

### 🎯 What's Improved

#### Dashboard Layout
- **Reduced Clutter** - Advanced settings hidden from main dashboard view
- **Intuitive Access** - Daily controls easily accessible, configuration tucked away
- **Better Organization** - Settings appear where users expect to find them
- **Cleaner Interface** - Focus on essential controls for daily use

#### Configuration Management
- **Sound Settings Group** - Media player, alarm sound, custom URL, volume, repeat options
- **Timing Settings Group** - Snooze duration, max snoozes, auto-dismiss timing
- **Script Settings Group** - Pre-alarm, main alarm, and post-alarm script configuration
- **Logical Grouping** - Related settings grouped together for easier management

### 🔧 Technical Implementation

#### Entity Categories Applied
- **Switch Entities** - Pre-alarm enabled, post-alarm enabled, repeat sound → CONFIG
- **Text Entities** - Pre-alarm script, alarm script, post-alarm script, custom sound URL → CONFIG
- **Number Entities** - All timing and volume controls → CONFIG
- **Select Entities** - Media player and sound selection → CONFIG

#### Maintained Functionality
- **No Breaking Changes** - All existing functionality preserved
- **Same Entity IDs** - All entities maintain same unique identifiers
- **Backward Compatibility** - Existing configurations continue working unchanged

### 📋 Entity Organization Summary

#### **Controls (Main Dashboard)**
- `time.{name}_alarm_time` - Set alarm time
- `switch.{name}_enabled` - Enable/disable alarm
- `switch.{name}_monday` through `switch.{name}_sunday` - Day toggles
- `button.{name}_snooze` - Snooze button
- `button.{name}_dismiss` - Dismiss button
- `sensor.{name}_next_alarm` - Next alarm time
- `sensor.{name}_status` - Current status
- `sensor.{name}_time_until_alarm` - Countdown

#### **Configuration (Device Settings)**
- Sound: Media player, alarm sound, custom URL, volume, repeat
- Timing: Snooze duration, max snoozes, auto-dismiss, pre/post-alarm timing
- Scripts: Pre-alarm, main alarm, post-alarm script entities

### 🚀 Benefits

- **User-Friendly** - Clear separation of daily controls vs setup options
- **Reduced Clutter** - Main dashboard focused on essential controls
- **Better Discovery** - Configuration options logically organized
- **Professional Experience** - Matches Home Assistant UI patterns

---

## [2.3.1] - 2025-07-12

### 🛠️ Bug Fixes

#### Custom Sound URL Display Issue
- **Fixed "Unknown" Display** - Custom sound URL text entity now properly shows empty field instead of "unknown"
- **Proper Empty Value Handling** - Text entity returns empty string `""` instead of `None` for unset URLs
- **Entity Categorization** - All sound configuration entities properly categorized as `EntityCategory.CONFIG`

#### Entity Structure Improvements
- **Coordinator Pattern** - Fixed select entities to use proper `CoordinatorEntity` inheritance
- **Entity Properties** - Added all required entity properties like `device_info`, `entity_category`
- **Consistent Patterns** - Aligned all configuration entities with same structure and patterns

### 🔧 Technical Improvements

#### Configuration Entity Organization
- **Proper Categories** - All sound settings grouped in device configuration section
- **Consistent Icons** - Appropriate icons for all configuration entities
- **Entity Naming** - Clear, descriptive names for all configuration entities

#### Code Quality
- **Import Cleanup** - Removed unused imports and fixed entity inheritance
- **Error Handling** - Improved error handling in entity setup and configuration updates
- **Type Hints** - Enhanced type hints for better IDE support

### 🎯 What's Fixed

- ✅ **Custom Sound URL field displays properly** - No more "unknown" text in empty field
- ✅ **All sound entities visible** - Media player and sound configuration entities now appear correctly
- ✅ **Proper entity categorization** - All configuration entities properly grouped in device settings
- ✅ **Consistent entity behavior** - All configuration entities follow same patterns and work reliably

### 📝 Migration Notes

- No configuration changes required
- All existing settings preserved
- Entities will update automatically after integration restart
- Custom sound URLs will display properly after update

---

## [2.3.0] - 2025-07-12

### 🔄 Major Enhancement: Dynamic Sound Configuration

#### Real-Time Configuration Entities
- **Dynamic Media Player Selection** - Change media player through `select.{name}_media_player` entity
- **Sound Selection Interface** - Choose alarm sounds via `select.{name}_alarm_sound` entity
- **Custom URL Support** - Enter custom sound URLs with `text.{name}_custom_sound_url` entity
- **Volume Control** - Adjust volume dynamically with `number.{name}_alarm_volume` entity
- **Repeat Toggle** - Control sound repeating with `switch.{name}_repeat_sound` entity

#### Configuration Management
- **Persistent Storage** - All changes automatically saved to config entry
- **Real-time Updates** - Changes apply immediately without integration restart
- **Backward Compatibility** - Existing configurations continue working unchanged
- **Error Resilience** - Comprehensive error handling for all configuration operations

#### User Experience Improvements
- **No Integration Restart** - All sound settings changeable through Home Assistant UI
- **Card Integration Ready** - All entities available for dashboard cards and automations
- **Configuration Categories** - Sound settings properly organized in device configuration
- **Professional UI** - Proper entity icons, categories, and descriptions

### 🔧 Technical Implementation

#### New Entity Platforms
- **Select Platform** - Added select.py with media player and sound selection entities
- **Enhanced Text Platform** - Added custom sound URL text entity with proper validation
- **Enhanced Number Platform** - Added volume control with proper range and steps
- **Enhanced Switch Platform** - Added repeat sound toggle with proper state management

#### Coordinator Enhancements
- **Dynamic Config Updates** - New `_update_config()` method for live configuration changes
- **Media Player Methods** - Enhanced media player integration methods
- **State Persistence** - Improved state management and persistence
- **Error Handling** - Comprehensive error handling for configuration operations

### 🎯 New Configuration Entities

- `select.{name}_media_player` - Choose from available media players
- `select.{name}_alarm_sound` - Select from built-in sounds or custom URL
- `text.{name}_custom_sound_url` - Enter custom sound file URLs
- `number.{name}_alarm_volume` - Control volume (0-100%)
- `switch.{name}_repeat_sound` - Toggle sound repeating

### 🚀 Benefits

- **User-Friendly Configuration** - No need to recreate integrations to change settings
- **Real-time Responsiveness** - Changes take effect immediately
- **Dashboard Integration** - All settings available for cards and automations
- **Professional Experience** - Proper entity organization and categorization

---

## [2.2.0] - 2025-07-12

### 🔊 Major New Feature: Built-in Sound Support

#### Direct Media Player Integration
- **Native Sound Playback** - Direct integration with Home Assistant media players for alarm sounds
- **Built-in Sound Library** - Four built-in alarm sounds with web-based URLs:
  - **Classic Alarm Beep** - Traditional alarm clock sound
  - **Gentle Chime** - Soft bell chime for gentle wake-up
  - **Urgent Beep** - More intense beeping for heavy sleepers
  - **Digital Alarm** - Modern digital alarm sound
- **Custom Sound Support** - Support for custom sound URLs alongside built-in options
- **Volume Control** - Configurable alarm volume (0-100%) with automatic volume setting

#### Enhanced Configuration Flow
- **Multi-Step Setup** - Enhanced configuration flow with dedicated media player setup step
- **Media Player Selection** - Choose from available media players during setup
- **Sound Preview** - Built-in sound options with descriptions for easy selection
- **Volume Slider** - Intuitive volume control during configuration
- **Custom URL Input** - Conditional input field for custom sound URLs

#### Smart Sound Management
- **Automatic Playback** - Sounds play automatically when alarm triggers
- **Proper Volume Setting** - Media player volume set before sound playback
- **Sound Stopping** - Automatic sound stopping on snooze or dismiss
- **Error Handling** - Graceful fallback when media player unavailable
- **Event Logging** - Sound start/stop events logged for troubleshooting

### 🔧 Technical Implementation

#### Coordinator Enhancements
- **Media Player Methods** - New `_async_play_alarm_sound()` and `_async_stop_alarm_sound()` methods
- **Sound URL Resolution** - Intelligent URL resolution for built-in and custom sounds
- **Volume Management** - Automatic volume level conversion and setting
- **State Integration** - Sound playback integrated with existing alarm state machine

#### Configuration System
- **New Constants** - Added media player configuration constants and built-in sound definitions
- **Enhanced Config Flow** - Multi-step configuration with media player and sound selection
- **Backward Compatibility** - Existing script-based setups continue to work unchanged
- **State Attributes** - Media player settings exposed in entity state attributes

#### Dependency Updates
- **Media Player Dependency** - Added `media_player` dependency to manifest.json
- **Service Integration** - Native `media_player.play_media` and `media_player.volume_set` service calls
- **Error Resilience** - Comprehensive error handling for media player operations

### ✨ User Experience Improvements

#### Configuration Ease
- **Guided Setup** - Step-by-step configuration with clear options
- **No Script Required** - Simple sound playback without needing to create scripts
- **Multiple Options** - Choose from built-in sounds or provide custom URLs
- **Preview Descriptions** - Clear descriptions of each built-in sound option

#### Sound Quality
- **Professional Sounds** - High-quality built-in alarm sounds
- **Consistent Volume** - Reliable volume control across different media players
- **Immediate Playback** - Sounds start playing immediately when alarm triggers
- **Clean Stopping** - Sounds stop cleanly when alarm is dismissed or snoozed

### 🎯 What's New

- ✅ **Built-in Sound Library** - Four professional alarm sounds ready to use
- ✅ **Media Player Integration** - Direct support for any Home Assistant media player
- ✅ **Custom Sound URLs** - Support for your own sound files
- ✅ **Volume Control** - Configurable volume with automatic setting
- ✅ **Smart Sound Management** - Automatic play/stop with proper state handling
- ✅ **Backward Compatible** - Existing script-based setups continue working
- ✅ **Error Resilient** - Graceful handling of media player issues

### 🚀 Usage Examples

#### Basic Sound Setup
```yaml
# Configuration during setup
Media Player: media_player.bedroom_speaker
Alarm Sound: Classic Alarm Beep
Volume: 50%
```

#### Custom Sound Setup
```yaml
# Configuration during setup
Media Player: media_player.living_room_speaker
Alarm Sound: Custom URL
Custom Sound URL: https://example.com/my-alarm.mp3
Volume: 75%
```

#### Sound + Script Combination
```yaml
# Can use both media player sounds AND scripts
Media Player: media_player.bedroom_speaker  # Plays built-in sound
Alarm Sound: Gentle Chime
Alarm Script: script.morning_routine        # Also runs script
```

### 📋 Configuration Options

#### Built-in Sound URLs
- **Classic Alarm Beep**: `https://www.soundjay.com/misc/sounds/bell-ringing-05.wav`
- **Gentle Chime**: `https://www.soundjay.com/misc/sounds/bell-ringing-01.wav`
- **Urgent Beep**: `https://www.soundjay.com/misc/sounds/beep-07a.wav`
- **Digital Alarm**: `https://www.soundjay.com/misc/sounds/beep-10.wav`

#### New State Attributes
- `media_player_entity` - Configured media player entity
- `alarm_sound` - Selected alarm sound type
- `custom_sound_url` - Custom sound URL (if applicable)
- `alarm_volume` - Configured volume level
- `sound_url` - Resolved sound URL for playback

### 🔧 Breaking Changes

None - this is a backwards-compatible feature addition.

### 📝 Migration Notes

- **Existing Setups** - All existing alarm clocks continue working unchanged
- **Optional Feature** - Media player integration is optional during setup
- **Script Compatibility** - Can use both media player sounds and scripts together
- **No Restart Required** - Feature available immediately after update

---

## [2.1.3] - 2025-07-12

### 🚨 Critical Bug Fix

#### IntentResponse API Compatibility Fix
- **Fixed Critical Voice Control Error** - Fixed IntentResponse constructor missing required 'language' parameter
- **Complete API Fix** - Updated all IntentResponse instantiations across all 8 intent handlers
- **Voice Commands Now Work** - All voice commands now function correctly without "operation failed" errors
- **Proper Error Handling** - Maintained comprehensive exception handling while fixing API compatibility

### 🔧 Technical Changes

#### Intent Handler API Updates
- **SetAlarmIntent** - Fixed all 5 IntentResponse calls to include language parameter
- **EnableAlarmIntent** - Fixed all 3 IntentResponse calls to include language parameter
- **DisableAlarmIntent** - Fixed all 3 IntentResponse calls to include language parameter
- **SnoozeAlarmIntent** - Fixed all 3 IntentResponse calls to include language parameter
- **DismissAlarmIntent** - Fixed all 3 IntentResponse calls to include language parameter
- **AlarmStatusIntent** - Fixed all 4 IntentResponse calls to include language parameter
- **EnableDayIntent** - Fixed all 5 IntentResponse calls to include language parameter
- **DisableDayIntent** - Fixed all 5 IntentResponse calls to include language parameter

### 🎯 What's Fixed

- ✅ **Voice commands work without errors** - "Set alarm for 7:30 AM" → "Alarm set for 7:30 am"
- ✅ **All intent handlers functional** - Every voice command type now works correctly
- ✅ **Proper voice responses** - Voice assistant provides correct confirmations
- ✅ **Home Assistant API compatibility** - Fixed for current HA version requirements

### 📝 Root Cause

**Error Pattern**:
```
TypeError: IntentResponse.__init__() missing 1 required positional argument: 'language'
```

**Fix Applied**:
```python
# Before (Broken)
response = intent.IntentResponse()

# After (Fixed) 
response = intent.IntentResponse(language=intent_obj.language)
```

### 📋 Migration Notes

- No configuration changes required
- Voice control now works properly without errors
- All existing voice commands continue to work
- All functionality preserved with correct API usage

---

## [2.1.2] - 2025-07-12

### 📝 Documentation Enhancement

#### Enhanced Voice Control Documentation
- **Comprehensive README.md Update** - Added detailed voice control section with examples and responses
- **Advanced Voice Features** - Documented natural language processing and room-specific targeting
- **Voice Command Reference** - Complete command list with expected voice assistant responses
- **Setup Instructions** - Added voice control prerequisites and quick start guide

#### Voice Control Examples
- **Command Examples** - Added "Command → Response" format showing exact voice feedback
- **Room-Specific Examples** - Documented multi-room voice targeting capabilities
- **Natural Language Examples** - Showed flexible time format support and phrasing variations
- **Day Management Examples** - Complete weekday/weekend voice control documentation

#### Technical Documentation
- **Voice Setup Guide** - Prerequisites, configuration, and troubleshooting
- **Integration Details** - How voice control integrates with existing features
- **Multi-Room Support** - Area detection and intelligent device targeting
- **Cross-References** - Links to detailed VOICE_CONTROL.md documentation

### 🎯 What's Improved

- ✅ **Complete Voice Documentation** - README.md now includes comprehensive voice control section
- ✅ **Command Examples** - All voice commands documented with expected responses
- ✅ **Setup Instructions** - Clear voice control setup and configuration guide
- ✅ **Feature Integration** - Voice control properly highlighted in feature list

---

## [2.1.1] - 2025-07-12

### 🐛 Bug Fix

#### Voice Control Error Handling
- **Fixed Voice Command Error Messages** - Voice commands now work without returning "operation failed" errors
- **Added Exception Handling** - Comprehensive try-catch blocks in all intent handlers prevent uncaught exceptions
- **Improved Error Responses** - Better error messages when voice commands genuinely fail
- **Enhanced Logging** - Added detailed error logging for voice command troubleshooting

### 🔧 Technical Changes

#### Intent Handler Improvements
- **SetAlarmIntent** - Added error handling for time parsing and coordinator operations
- **EnableAlarmIntent** - Protected alarm enabling operations with exception handling
- **DisableAlarmIntent** - Safe error handling for alarm disabling operations
- **SnoozeAlarmIntent** - Exception protection for snooze operations
- **DismissAlarmIntent** - Error handling for dismiss actions
- **AlarmStatusIntent** - Protected status query operations
- **EnableDayIntent** - Safe day management operations
- **DisableDayIntent** - Protected day disable operations

### 🎯 What's Fixed

- ✅ **Voice commands work without error messages** - "Set alarm for 7:30 AM" → "Alarm set for 7:30 am"
- ✅ **Proper success confirmations** - Voice assistant provides correct feedback
- ✅ **Better error handling** - Genuine errors now provide helpful messages
- ✅ **Enhanced reliability** - Voice control system more robust and stable

### 📝 Migration Notes

- No configuration changes required
- Voice control functionality improved automatically
- All existing voice commands continue to work
- Error messages now accurate and helpful

---

## [2.1.0] - 2025-07-12

### 🎤 Major New Feature: Voice Control

#### Home Assistant Voice Preview Integration
- **Complete Voice Control** - Full voice control integration using Home Assistant Voice Preview
- **Natural Language Processing** - Supports various time formats and natural language commands
- **Room-Specific Targeting** - Voice commands automatically target the alarm clock in the current room
- **Comprehensive Command Set** - All alarm functions accessible via voice commands

#### Voice Commands Supported
- **Setting Alarms** - "Set alarm for 7:30 AM", "Wake me up at six thirty", "Set bedroom alarm for 8:00 AM"
- **Enabling/Disabling** - "Turn on alarm", "Turn off my alarm", "Enable alarm for weekdays"
- **Active Control** - "Snooze", "Stop alarm", "Dismiss alarm"
- **Status Queries** - "What time is my alarm?", "Is my alarm on?", "When is my alarm?"
- **Day Management** - "Turn on alarm for Monday", "Enable alarm for weekdays", "Turn off alarm for Saturday"

#### Advanced Voice Features
- **Time Format Recognition** - Supports "7:30 AM", "seven thirty", "6:00 in the morning", "8:00 at night"
- **Room Context Awareness** - Commands in bedroom target bedroom alarm, kitchen commands target kitchen alarm
- **Confirmation Responses** - Voice assistant confirms actions: "Alarm set for 7:30 am", "Alarm snoozed for 9 minutes"
- **Fallback Logic** - If no room-specific alarm found, uses first available alarm clock

#### Technical Implementation
- **Intent Handler System** - Custom intent handlers for each voice command type
- **Area/Room Detection** - Automatic detection of voice command origin room
- **Natural Language Parser** - Robust time parsing supporting multiple formats
- **Conversation Integration** - Native integration with Home Assistant's conversation system

### 🔧 Technical Changes

#### New Dependencies
- **Conversation Integration** - Added conversation dependency to manifest.json
- **Intent Registration** - Voice intents automatically registered during integration setup
- **Room-Based Entity Discovery** - Enhanced entity discovery by area/room assignment

#### New Files
- **`intent_script.py`** - Voice intent handlers and room-specific targeting logic
- **`intents.yaml`** - Voice command patterns and sentence definitions
- **`VOICE_CONTROL.md`** - Comprehensive voice control documentation

### 📝 Documentation Updates

#### New Documentation
- **Voice Control Guide** - Complete guide to voice commands and setup
- **Room-Specific Setup** - Instructions for multi-room voice control
- **Troubleshooting** - Voice command troubleshooting and debugging

#### Updated Documentation
- **README.md** - Added voice control section and feature highlights
- **Features List** - Updated to include voice control as major feature

### 🎯 What's New

- ✅ **Complete Voice Control** - Set, enable, disable, snooze, dismiss, and query alarms by voice
- ✅ **Room-Specific Commands** - Voice commands automatically target the right alarm clock
- ✅ **Natural Language Support** - Understands various ways to express times and commands
- ✅ **Zero Configuration** - Voice control works automatically once integration is set up
- ✅ **Comprehensive Commands** - Every alarm function accessible via voice
- ✅ **Smart Responses** - Voice assistant provides helpful confirmations and feedback

### 🚀 Usage Examples

#### Basic Voice Control
```
"Set alarm for 7:30 AM" → "Alarm set for 7:30 am"
"Turn on alarm" → "Alarm enabled for 7:30 am"
"What time is my alarm?" → "Your alarm is set for 7:30 am and is currently enabled"
```

#### Room-Specific Control
```
In bedroom: "Set alarm for 7:30 AM" → Sets bedroom alarm
In kitchen: "Turn on alarm" → Enables kitchen alarm
In living room: "Snooze" → Snoozes living room alarm
```

#### Day Management
```
"Enable alarm for weekdays" → "Alarm enabled for weekdays"
"Turn off alarm for Saturday" → "Alarm disabled for Saturday"
```

### 📋 Requirements

- **Home Assistant Voice Preview** - Voice control requires HA Voice Preview enabled
- **Area Assignment** - Alarm clock devices should be assigned to correct areas/rooms
- **Voice Assistant** - Compatible voice assistant device or Home Assistant's built-in assistant

### 🔧 Breaking Changes

None - this is a backwards-compatible feature addition.

### 📝 Migration Notes

- No configuration changes required
- Voice control works automatically once integration is updated
- Assign alarm clock devices to correct areas/rooms for best room-specific targeting
- All existing alarm settings and functionality preserved

---

## [1.3.0] - 2025-07-10

### 🚀 Major Architecture Refactoring

#### Home Assistant Coordinator Pattern
- **Migrated to DataUpdateCoordinator** - Complete refactoring to use proper HA coordinator pattern
- **Centralized State Management** - All alarm logic now centralized in AlarmClockCoordinator
- **Thin Entity Wrappers** - Entities now just expose coordinator data via standard HA patterns
- **Standard HA Structure** - Follows Home Assistant best practices for integration architecture

#### Unique ID-Based Entity Discovery
- **Rename-Proof Architecture** - Card now uses unique_id patterns instead of entity names
- **Clean Unique ID Patterns** - Simplified from `alarm_clock_{entry_id}` to just `{entry_id}` for main entity
- **Registry-Based Discovery** - Works even when entities don't have states yet
- **Future-Proof Design** - Entity renames won't break card functionality

#### Real-Time Responsiveness
- **1-Second Update Interval** - Changed coordinator from 30-second to 1-second updates
- **Immediate Service Call Refresh** - All service calls trigger instant coordinator refresh
- **Responsive UI Updates** - Card now responds immediately to button clicks (<1 second)
- **Double-Layer Responsiveness** - Both backend push and frontend pull for instant feedback

### 🛠️ Bug Fixes

#### Entity Discovery Issues
- **Fixed Card Entity Detection** - Resolved "Could not find coordinator" errors
- **Registry vs State Handling** - Fixed entities existing in registry but not having states
- **Fallback Entity Values** - Added fallback handling for entities without states
- **Platform Detection** - Fixed entity platform detection issues

#### UI Responsiveness
- **Eliminated 15-Second Delays** - Fixed slow response when clicking "Enable Alarm"
- **Immediate Visual Feedback** - All card interactions now provide instant feedback
- **Force Refresh Logic** - Added immediate refresh after all service calls

### ✨ Technical Improvements

#### Code Architecture
- **Proper HA Patterns** - Now follows Home Assistant coordinator best practices
- **Single Source of Truth** - Coordinator manages all state, entities just expose it
- **Better Error Handling** - Enhanced error handling and fallback mechanisms
- **Cleaner Entity Structure** - Simplified entity relationships and dependencies

#### Performance Optimizations
- **Real-Time Updates** - 1-second coordinator refresh for live status monitoring
- **Efficient State Propagation** - Optimized data flow between coordinator and entities
- **Reduced Entity Coupling** - Entities no longer directly communicate with each other

### 🔧 Breaking Changes

#### Internal Architecture
- **Coordinator Required** - Entities now require coordinator for proper operation
- **Entity Dependencies** - Some entity initialization order changes
- **Unique ID Format** - Main entity unique_id simplified (internal change)

### 📝 Migration Notes

- **Restart Required** - Restart Home Assistant after updating to apply coordinator changes
- **Browser Refresh** - Hard refresh browser (Ctrl+F5) to load updated card
- **No Config Changes** - All existing alarm settings preserved
- **Performance Improvement** - Should notice much faster UI responsiveness

### 🎯 What's Improved

- ✅ **Instant Responsiveness** - Card responds in ~1 second instead of 15 seconds
- ✅ **Rename-Proof Design** - Renaming entities won't break card functionality  
- ✅ **Proper HA Architecture** - Follows Home Assistant coordinator best practices
- ✅ **Real-Time Updates** - Live status monitoring with 1-second precision
- ✅ **Better Error Handling** - More robust entity discovery and state management
- ✅ **Future-Proof** - Clean architecture for easier maintenance and features

---

## [1.1.3] - 2025-07-09

### 🚨 Critical Bug Fix

#### Dismiss Button Functionality  
- **Fixed Dismiss Button Not Working** - Restore immediate alarm dismissal functionality
- **Proper State Flow** - Dismiss now immediately sets state to OFF, then calculates next alarm
- **Auto-dismiss Fix** - Applied same fix to auto-dismiss timer functionality

### 🎯 What's Fixed

**The Problem:**
- Dismiss button stopped working after v1.1.2 recurring alarm fix
- Clicking dismiss did nothing - alarm kept ringing
- Auto-dismiss also broken

**Root Cause:**
- Removed immediate state change to `ALARM_STATE_OFF` in dismiss methods
- Relied entirely on `_async_update_alarm_state()` to set new state
- This broke immediate dismiss functionality

**The Solution:**
- Restored immediate `self._state = ALARM_STATE_OFF` 
- Write state to HA immediately so user sees alarm dismissed
- Then recalculate next alarm occurrence for recurring functionality
- Update sensors with new next alarm time

### 🔧 Technical Details

**Correct Dismiss Flow:**
1. **Immediately set state to OFF** (stops current alarm)  
2. **Write state to HA immediately** (user sees alarm dismissed)
3. **Then recalculate next alarm occurrence** (for recurring)
4. **Update sensors** with new next alarm

Applied to both `async_dismiss()` and `_async_auto_dismiss()` methods.

### 📝 Impact

This fixes the critical regression where dismiss functionality was completely broken. Now dismiss works immediately AND alarms still recur properly.

---

## [1.1.2] - 2025-07-09

### 🚨 Critical Bug Fix

#### Recurring Alarm Functionality
- **Fixed Critical Recurring Alarm Bug** - Alarms now properly advance to next occurrence after dismiss/auto-dismiss
- **Immediate State Recalculation** - `async_dismiss()` and `_async_auto_dismiss()` now call `_async_update_alarm_state()`
- **Sensor Synchronization** - Both dismiss methods trigger `_async_update_related_entities()` for real-time updates

### 🎯 What's Fixed

**Before (Broken):**
- Alarm rings Monday 7:00 AM → User dismisses → Alarm stays OFF permanently
- Next alarm sensor shows "None" 
- Alarm never rings again until manually re-enabled

**After (Fixed):**
- Alarm rings Monday 7:00 AM → User dismisses → Immediately arms for Tuesday 7:00 AM
- Next alarm sensor immediately shows "Tuesday at 7:00 AM"
- Alarm properly recurs as expected

### 📝 Impact

This was a **critical functionality bug** that made alarms behave as one-time instead of recurring. All users should update immediately to restore proper recurring alarm behavior.

### 🔧 Technical Details

- Added `await self._async_update_alarm_state()` to both dismiss methods
- Added `await self._async_update_related_entities()` for sensor updates
- Ensures alarm state machine properly advances to next scheduled occurrence
- Maintains all timing and script execution logic

---

## [1.1.1] - 2025-07-09

### 🛠️ Bug Fixes

#### UI/Layout Improvements
- **Fixed Day Button Layout** - Resolved Sunday button getting cut off on narrow cards
- **Responsive Design** - Switched from CSS grid to flexbox for better space distribution
- **Optimized Spacing** - Reduced gaps and font sizes for better fit on all card widths

#### Sensor Synchronization
- **Fixed Sensor Updates** - Next alarm and time until sensors now update immediately when alarm time or days change
- **Real-time Recalculation** - Sensors properly recalculate values without requiring page refresh
- **Direct Entity References** - Improved sensor update mechanism using stored entity references

### ✨ Technical Improvements

#### Layout System
- **Flexbox Implementation** - Changed day buttons from `grid` to `flex` with `justify-content: space-between`
- **Calculated Sizing** - Added `max-width: calc((100% - 12px) / 7)` for precise button sizing
- **Responsive Spacing** - Reduced gap from 8px → 2px and font-size from 12px → 10px

#### Entity Management
- **Sensor Registration** - Sensors now register themselves with main entity during setup
- **Force Updates** - Added direct `async_write_ha_state()` calls for immediate sensor updates
- **Better Synchronization** - Improved communication between main entity and sensor entities

### 🎯 What's Fixed

- ✅ All 7 day buttons now fit properly on narrow cards without Sunday cutoff
- ✅ Next alarm sensor updates immediately when time or days change
- ✅ Time until sensor recalculates countdown in real-time
- ✅ No page refresh required for sensor updates
- ✅ Improved responsive layout across all card sizes

### 📝 Migration Notes

- Hard refresh your browser (Ctrl+F5) after updating to see the layout fixes
- No configuration changes required
- All existing alarm settings preserved

---

## [1.1.0] - 2025-07-09

### 🛠️ Bug Fixes & Improvements

#### Frontend Card Fixes
- **Fixed Status Indicator** - Correctly maps to `switch.alarm_clock_enabled` instead of wrong entity
- **Fixed Day Button Updates** - Real-time state changes without requiring browser refresh
- **Enhanced Entity Discovery** - Improved entity mapping logic to prevent conflicts

#### Sensor Updates Fixed
- **Fixed Next Alarm Sensor** - Now updates immediately when alarm time or days are changed
- **Fixed Time Until Sensor** - Recalculates countdown instantly when configuration changes
- **Real-time Synchronization** - All sensors stay in sync with main entity without refresh

#### User Experience Improvements
- **12-Hour Time Format** - Display now shows "8:25 PM" instead of "20:25" for better readability
- **Immediate Visual Feedback** - All button clicks now provide instant visual responses
- **Cleaner Interface** - Removed debug logging for production use

#### Backend Synchronization
- **Fixed State Sync** - Resolved switch/main entity synchronization issues
- **Improved State Logic** - Always updates state when alarm enabled/disabled changes
- **Better Error Handling** - Enhanced entity communication reliability
- **Direct Entity References** - Simplified sensor update mechanism using stored references

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
