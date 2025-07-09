class AlarmClockCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this._config = {};
        this._hass = null;
        this._entities = {};
    }

    set hass(hass) {
        this._hass = hass;
        this._updateEntities();
        this._updateCard();
    }

    setConfig(config) {
        if (!config.entity) {
            throw new Error('You need to define an entity');
        }
        this._config = config;
        this._setupCard();
    }

    _setupCard() {
        const style = document.createElement('style');
        style.textContent = `
            :host {
                display: block;
                background: var(--ha-card-background, var(--card-background-color, white));
                border-radius: var(--ha-card-border-radius, 12px);
                box-shadow: var(--ha-card-box-shadow, 0 2px 8px rgba(0,0,0,0.1));
                padding: 24px;
                font-family: var(--paper-font-body1_-_font-family);
            }

            .header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
            }

            .title {
                font-size: 24px;
                font-weight: 500;
                color: var(--primary-text-color);
            }

            .status {
                font-size: 14px;
                padding: 4px 12px;
                border-radius: 16px;
                font-weight: 500;
                text-transform: uppercase;
            }

            .status.off { background: #f44336; color: white; }
            .status.armed { background: #4caf50; color: white; }
            .status.ringing { background: #ff9800; color: white; animation: blink 1s infinite; }
            .status.snoozed { background: #2196f3; color: white; }

            @keyframes blink {
                0%, 50% { opacity: 1; }
                51%, 100% { opacity: 0.3; }
            }

            .time-display {
                text-align: center;
                margin: 20px 0;
            }

            .alarm-time {
                font-size: 48px;
                font-weight: 300;
                color: var(--primary-text-color);
                margin-bottom: 8px;
            }

            .next-alarm {
                font-size: 14px;
                color: var(--secondary-text-color);
            }

            .controls {
                display: flex;
                gap: 12px;
                margin: 20px 0;
            }

            .control-button {
                flex: 1;
                padding: 12px;
                border: none;
                border-radius: 8px;
                font-size: 14px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.2s;
            }

            .control-button:hover {
                transform: translateY(-1px);
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            }

            .control-button:active {
                transform: translateY(0);
            }

            .control-button.primary {
                background: var(--primary-color);
                color: white;
            }

            .control-button.secondary {
                background: var(--secondary-background-color);
                color: var(--primary-text-color);
            }

            .control-button.danger {
                background: #f44336;
                color: white;
            }

            .control-button:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }

            .days-grid {
                display: grid;
                grid-template-columns: repeat(7, 1fr);
                gap: 8px;
                margin: 20px 0;
            }

            .day-button {
                padding: 8px 4px;
                border: none;
                border-radius: 6px;
                font-size: 12px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.2s;
                background: var(--secondary-background-color);
                color: var(--secondary-text-color);
            }

            .day-button.active {
                background: var(--primary-color);
                color: white;
            }

            .day-button:hover {
                transform: translateY(-1px);
            }

            .scripts-info {
                margin-top: 20px;
                padding: 16px;
                background: var(--secondary-background-color);
                border-radius: 8px;
            }

            .scripts-title {
                font-size: 16px;
                font-weight: 500;
                margin-bottom: 12px;
                color: var(--primary-text-color);
            }

            .script-item {
                display: flex;
                justify-content: space-between;
                margin-bottom: 8px;
                font-size: 14px;
            }

            .script-label {
                color: var(--secondary-text-color);
            }

            .script-value {
                color: var(--primary-text-color);
                font-weight: 500;
            }

            .snooze-info {
                margin-top: 16px;
                padding: 12px;
                background: var(--warning-color, #ff9800);
                color: white;
                border-radius: 8px;
                text-align: center;
            }

            .time-picker {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                margin: 16px 0;
            }

            .time-input {
                padding: 8px 12px;
                border: 1px solid var(--divider-color);
                border-radius: 6px;
                font-size: 16px;
                background: var(--card-background-color);
                color: var(--primary-text-color);
            }
        `;

        this.shadowRoot.appendChild(style);
        this._updateCard();
    }

    _updateEntities() {
        if (!this._hass || !this._config.entity) return;

        const baseEntity = this._config.entity;
        const entityId = baseEntity.replace('alarm_clock.', '');
        
        this._entities = {
            main: this._hass.states[baseEntity],
            time: this._hass.states[`time.${entityId}_alarm_time`],
            enabled: this._hass.states[`switch.${entityId}_alarm_enabled`],
            snooze: this._hass.states[`switch.${entityId}_snooze`],
            status: this._hass.states[`sensor.${entityId}_alarm_status`],
            nextAlarm: this._hass.states[`sensor.${entityId}_next_alarm`],
            timeUntil: this._hass.states[`sensor.${entityId}_time_until_alarm`],
            days: {}
        };

        // Get day switches
        const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        days.forEach(day => {
            this._entities.days[day] = this._hass.states[`switch.${entityId}_${day}`];
        });
    }

    _updateCard() {
        if (!this._entities.main) return;

        const main = this._entities.main;
        const timeEntity = this._entities.time;
        const enabledEntity = this._entities.enabled;
        const statusEntity = this._entities.status;
        const nextAlarmEntity = this._entities.nextAlarm;
        const snoozeEntity = this._entities.snooze;

        const alarmTime = timeEntity ? timeEntity.state : '07:00';
        const isEnabled = enabledEntity ? enabledEntity.state === 'on' : false;
        const status = statusEntity ? statusEntity.state : 'off';
        const nextAlarm = nextAlarmEntity ? nextAlarmEntity.attributes.next_alarm_time : null;
        const nextAlarmDay = nextAlarmEntity ? nextAlarmEntity.attributes.next_alarm_day : null;

        this.shadowRoot.innerHTML = `
            <style>${this.shadowRoot.querySelector('style').textContent}</style>
            <div class="header">
                <div class="title">${this._config.name || 'Alarm Clock'}</div>
                <div class="status ${status}">${status}</div>
            </div>

            <div class="time-display">
                <div class="alarm-time">${alarmTime}</div>
                ${nextAlarm ? `<div class="next-alarm">Next alarm: ${nextAlarmDay} ${nextAlarm}</div>` : ''}
            </div>

            <div class="time-picker">
                <input type="time" class="time-input" value="${alarmTime}" id="timeInput">
                <button class="control-button secondary" onclick="this.getRootNode().host._setAlarmTime()">Set Time</button>
            </div>

            <div class="controls">
                <button class="control-button ${isEnabled ? 'danger' : 'primary'}" onclick="this.getRootNode().host._toggleAlarm()">
                    ${isEnabled ? 'Disable' : 'Enable'} Alarm
                </button>
                ${status === 'ringing' ? `
                    <button class="control-button secondary" onclick="this.getRootNode().host._snoozeAlarm()">Snooze</button>
                    <button class="control-button danger" onclick="this.getRootNode().host._dismissAlarm()">Dismiss</button>
                ` : ''}
            </div>

            <div class="days-grid">
                ${this._renderDays()}
            </div>

            ${this._renderScriptsInfo()}
            ${status === 'snoozed' ? this._renderSnoozeInfo() : ''}
        `;
    }

    _renderDays() {
        const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        
        return days.map((day, index) => {
            const dayEntity = this._entities.days[day];
            const isActive = dayEntity ? dayEntity.state === 'on' : false;
            
            return `
                <button class="day-button ${isActive ? 'active' : ''}" 
                        onclick="this.getRootNode().host._toggleDay('${day}')">
                    ${dayLabels[index]}
                </button>
            `;
        }).join('');
    }

    _renderScriptsInfo() {
        const main = this._entities.main;
        if (!main || !main.attributes) return '';

        const scripts = [];
        
        if (main.attributes.pre_alarm_enabled && main.attributes.pre_alarm_script) {
            scripts.push({
                label: 'Pre-alarm',
                value: `${main.attributes.pre_alarm_script} (${main.attributes.pre_alarm_minutes}m before)`
            });
        }
        
        if (main.attributes.alarm_script) {
            scripts.push({
                label: 'Alarm',
                value: main.attributes.alarm_script
            });
        }
        
        if (main.attributes.post_alarm_enabled && main.attributes.post_alarm_script) {
            scripts.push({
                label: 'Post-alarm',
                value: `${main.attributes.post_alarm_script} (${main.attributes.post_alarm_minutes}m after)`
            });
        }

        if (scripts.length === 0) return '';

        return `
            <div class="scripts-info">
                <div class="scripts-title">Configured Scripts</div>
                ${scripts.map(script => `
                    <div class="script-item">
                        <span class="script-label">${script.label}:</span>
                        <span class="script-value">${script.value}</span>
                    </div>
                `).join('')}
            </div>
        `;
    }

    _renderSnoozeInfo() {
        const main = this._entities.main;
        if (!main || !main.attributes) return '';

        const snoozeCount = main.attributes.snooze_count || 0;
        const maxSnoozes = main.attributes.max_snoozes || 3;
        const snoozeUntil = main.attributes.snooze_until;

        return `
            <div class="snooze-info">
                Snoozed (${snoozeCount}/${maxSnoozes})
                ${snoozeUntil ? `<br>Until: ${new Date(snoozeUntil).toLocaleTimeString()}` : ''}
            </div>
        `;
    }

    _setAlarmTime() {
        const timeInput = this.shadowRoot.getElementById('timeInput');
        const time = timeInput.value;
        
        this._hass.callService('time', 'set_value', {
            entity_id: this._entities.time.entity_id,
            time: time
        });
    }

    _toggleAlarm() {
        const service = this._entities.enabled.state === 'on' ? 'turn_off' : 'turn_on';
        this._hass.callService('switch', service, {
            entity_id: this._entities.enabled.entity_id
        });
    }

    _toggleDay(day) {
        const dayEntity = this._entities.days[day];
        if (!dayEntity) return;

        const service = dayEntity.state === 'on' ? 'turn_off' : 'turn_on';
        this._hass.callService('switch', service, {
            entity_id: dayEntity.entity_id
        });
    }

    _snoozeAlarm() {
        this._hass.callService('alarm_clock', 'snooze', {
            entity_id: this._config.entity
        });
    }

    _dismissAlarm() {
        this._hass.callService('alarm_clock', 'dismiss', {
            entity_id: this._config.entity
        });
    }

    getCardSize() {
        return 6;
    }
}

customElements.define('alarm-clock-card', AlarmClockCard);

// Register the card with the custom card helpers
window.customCards = window.customCards || [];
window.customCards.push({
    type: 'alarm-clock-card',
    name: 'Alarm Clock Card',
    description: 'A card for displaying and controlling alarm clock entities',
    preview: true,
    documentationURL: 'https://github.com/your-username/alarm-clock'
});

// Add to the UI
console.info(
    `%c  ALARM-CLOCK-CARD  %c  Version 1.0.0  `,
    'color: orange; font-weight: bold; background: black',
    'color: white; font-weight: bold; background: dimgray'
);
