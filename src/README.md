# Alarm Clock Card

A custom Lovelace card for the Home Assistant Alarm Clock integration, built with TypeScript and Lit.

## Features

- **Visual Editor**: Easy configuration through the Home Assistant UI
- **Real-time Updates**: Live countdown with 1-second precision
- **Smart Countdown**: Shows snooze countdown when snoozed, alarm countdown when armed
- **Responsive Design**: Works on mobile and desktop
- **Configurable Display**: Toggle sections on/off through the visual editor
- **Material Design**: Uses Home Assistant's design system

## Installation

### Option 1: Manual Installation

1. Copy `alarm-clock-card.js` to your `www/alarm-clock-card/` folder
2. Add the card to your Lovelace resources:

```yaml
resources:
  - url: /local/alarm-clock-card/alarm-clock-card.js
    type: module
```

### Option 2: HACS (Coming Soon)

The card will be available through HACS once the integration is published.

### Option 3: Build from Source

```bash
cd ui
npm install
npm run build
# Copy dist/alarm-clock-card.js to your www folder
```

## Configuration

### Visual Editor

1. Add a new card in Lovelace
2. Search for "Alarm Clock Card"  
3. Select your alarm clock entity
4. Configure display options through the visual editor

### YAML Configuration

```yaml
type: custom:alarm-clock-card
entity: alarm_clock.my_alarm
name: "Bedroom Alarm"
show_time_picker: true
show_days: true
show_scripts: true
show_snooze_info: true
```

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `entity` | string | **Required** | Alarm clock entity ID |
| `name` | string | `"Alarm Clock"` | Card title |
| `show_time_picker` | boolean | `true` | Show the time picker input |
| `show_days` | boolean | `true` | Show day selection buttons |
| `show_scripts` | boolean | `true` | Show configured scripts info |
| `show_snooze_info` | boolean | `true` | Show snooze info when snoozed |

## Card Sections

### Header
- **Title**: Customizable card name
- **Status Badge**: Current alarm state (off/armed/ringing/snoozed)

### Time Display
- **Large Time**: Current alarm time
- **Next Alarm**: When the alarm will next trigger
- **Countdown**: Real-time countdown to alarm or snooze end

### Time Picker
- **Time Input**: Set alarm time directly
- **Set Button**: Apply the new time

### Controls
- **Enable/Disable**: Toggle alarm on/off
- **Snooze**: Available when alarm is ringing
- **Dismiss**: Available when alarm is ringing

### Day Selection
- **Day Buttons**: Toggle individual days of the week
- **Visual Feedback**: Active days highlighted

### Scripts Info
- **Pre-alarm**: Shows configured pre-alarm script and timing
- **Main Alarm**: Shows the main alarm script
- **Post-alarm**: Shows post-alarm script and timing

### Snooze Info
- **Snooze Counter**: Shows current snooze count vs. maximum
- **Time Until**: When the snooze will end

## Responsive Design

The card automatically adapts to different screen sizes:

- **Desktop**: Full layout with side-by-side elements
- **Mobile**: Stacked layout with larger touch targets
- **Tablet**: Balanced layout optimized for touch

## Theming

The card respects Home Assistant's theme system:

- **Colors**: Uses theme-defined colors for consistency
- **Typography**: Matches Home Assistant's font system
- **Spacing**: Follows Material Design guidelines

## Development

### Prerequisites

- Node.js 16+
- npm or yarn

### Setup

```bash
cd ui
npm install
```

### Development Mode

```bash
npm run dev
```

This starts webpack in watch mode for live development.

### Building

```bash
npm run build
```

Outputs optimized JavaScript to `dist/alarm-clock-card.js`.

### Linting

```bash
npm run lint
```

### Formatting

```bash
npm run format
```

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

The card uses modern web standards including:
- ES2020 JavaScript
- CSS Custom Properties
- Web Components
- Lit framework

## Troubleshooting

### Card Not Loading

1. Check browser console for errors
2. Verify the card is added to Lovelace resources
3. Ensure the alarm clock integration is installed
4. Check that the entity ID exists

### Entity Not Found

1. Verify the alarm clock integration is configured
2. Check that the entity ID in the card config matches your alarm entity
3. Restart Home Assistant if the integration was recently added

### Visual Editor Not Working

1. Clear browser cache
2. Check that you're using a supported browser
3. Verify Home Assistant is up to date

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.
