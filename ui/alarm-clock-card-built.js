class AlarmClockCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this._config = {};
        this._hass = null;
        this._entities = {};
    }

    static getConfigElement() {
        return document.createElement('alarm-clock-card-editor');
    }

    static getStubConfig() {
        return {
            type: 'custom:alarm-clock-card',
            entity: '',
            name: 'Alarm Clock',
            show_time_picker: true,
            show_days: true,
            show_scripts: true,
            show_snooze_info: true,
        };
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
        this._config = {
            show_time_picker: true,
            show_days: true,
            show_scripts: true,
            show_snooze_info: true,
            ...config,
        };
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

            .status.off { background: var(--error-color, #f44336); color: white; }
            .status.armed { background: var(--success-color, #4caf50); color: white; }
            .status.ringing { background: var(--warning-color, #ff9800); color: white; animation: blink 1s infinite; }
            .status.snoozed { background: var(--info-color, #2196f3); color: white; }

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
                margin-bottom: 8px;
            }

            .countdown {
                margin-top: 8px;
            }

            .countdown-label {
                font-size: 12px;
                color: var(--secondary-text-color);
                display: block;
                margin-bottom: 4px;
            }

            .countdown-time {
                font-size: 18px;
                font-weight: 500;
                color: var(--primary-color);
            }

            .controls {
                display: flex;
                gap: 12px;
                margin: 20px 0;
                flex-wrap: wrap;
            }

            .control-button {
                flex: 1;
                min-width: 120px;
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

            .control-button.primary {
                background: var(--primary-color);
                color: white;
            }

            .control-button.secondary {
                background: var(--secondary-background-color);
                color: var(--primary-text-color);
            }

            .control-button.danger {
                background: var(--error-color, #f44336);
                color: white;
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

            .time-picker {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 12px;
                margin: 20px 0;
            }

            .time-input {
                padding: 8px 12px;
                border: 1px solid var(--divider-color);
                border-radius: 8px;
                font-size: 16px;
                background: var(--card-background-color);
                color: var(--primary-text-color);
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
                flex-wrap: wrap;
                gap: 8px;
            }

            .script-label {
                color: var(--secondary-text-color);
            }

            .script-value {
                color: var(--primary-text-color);
                font-weight: 500;
                text-align: right;
                flex: 1;
            }

            .snooze-info {
                margin-top: 16px;
                padding: 12px;
                background: var(--warning-color, #ff9800);
                color: white;
                border-radius: 8px;
                text-align: center;
            }

            @media (max-width: 600px) {
                :host {
                    padding: 16px;
                }

                .alarm-time {
                    font-size: 36px;
                }

                .controls {
                    flex-direction: column;
                }

                .control-button {
                    flex: none;
                }

                .script-item {
                    flex-direction: column;
                    gap: 4px;
                }

                .script-value {
                    text-align: left;
                }
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
            time: this._hass.states[`time.${entityId}_time`],
            enabled: this._hass.states[`switch.${entityId}_alarm_enabled`],
            status: this._hass.states[`sensor.${entityId}_status`],
            nextAlarm: this._hass.states[`sensor.${entityId}_next_alarm`],
            timeUntil: this._hass.states[`sensor.${entityId}_time_until_alarm`],
            snoozeButton: this._hass.states[`button.${entityId}_snooze`],
            dismissButton: this._hass.states[`button.${entityId}_dismiss`],
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
        const timeUntilEntity = this._entities.timeUntil;

        const alarmTime = timeEntity?.state || '07:00';
        const isEnabled = enabledEntity?.state === 'on';
        const status = statusEntity?.state || 'off';
        const nextAlarm = nextAlarmEntity?.attributes?.next_alarm_time;
        const nextAlarmDay = nextAlarmEntity?.attributes?.next_alarm_day;
        const timeUntil = timeUntilEntity?.attributes?.human_readable;
        const countdownType = timeUntilEntity?.attributes?.countdown_type;

        const contentDiv = document.createElement('div');
        contentDiv.innerHTML = `
            <div class="header">
                <div class="title">${this._config.name || 'Alarm Clock'}</div>
                <div class="status ${status}">${status}</div>
            </div>

            <div class="time-display">
                <div class="alarm-time">${alarmTime}</div>
                ${nextAlarm ? `<div class="next-alarm">Next alarm: ${nextAlarmDay} ${nextAlarm}</div>` : ''}
                ${timeUntil ? `
                    <div class="countdown">
                        <span class="countdown-label">
                            ${countdownType === 'snooze' ? 'Snooze ends in:' : 'Alarm in:'}
                        </span>
                        <span class="countdown-time">${timeUntil}</span>
                    </div>
                ` : ''}
            </div>

            ${this._config.show_time_picker ? `
                <div class="time-picker">
                    <input type="time" class="time-input" value="${alarmTime}" id="timeInput">
                    <button class="control-button secondary" onclick="this.getRootNode().host._setAlarmTime()">Set Time</button>
                </div>
            ` : ''}

            <div class="controls">
                <button class="control-button ${isEnabled ? 'danger' : 'primary'}" onclick="this.getRootNode().host._toggleAlarm()">
                    ${isEnabled ? 'Disable' : 'Enable'} Alarm
                </button>
                ${status === 'ringing' ? `
                    <button class="control-button secondary" onclick="this.getRootNode().host._snoozeAlarm()">Snooze</button>
                    <button class="control-button danger" onclick="this.getRootNode().host._dismissAlarm()">Dismiss</button>
                ` : ''}
            </div>

            ${this._config.show_days ? this._renderDays() : ''}
            ${this._config.show_scripts ? this._renderScriptsInfo() : ''}
            ${this._config.show_snooze_info && status === 'snoozed' ? this._renderSnoozeInfo() : ''}
        `;

        // Clear existing content except style
        const existingContent = this.shadowRoot.querySelectorAll('div');
        existingContent.forEach(el => el.remove());

        this.shadowRoot.appendChild(contentDiv);
    }

    _renderDays() {
        const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        
        return `
            <div class="days-grid">
                ${days.map((day, index) => {
                    const dayEntity = this._entities.days[day];
                    const isActive = dayEntity?.state === 'on';
                    
                    return `
                        <button class="day-button ${isActive ? 'active' : ''}" 
                                onclick="this.getRootNode().host._toggleDay('${day}')">
                            ${dayLabels[index]}
                        </button>
                    `;
                }).join('')}
            </div>
        `;
    }

    _renderScriptsInfo() {
        const main = this._entities.main;
        if (!main?.attributes) return '';

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
        if (!main?.attributes) return '';

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
        
        if (this._entities.time) {
            this._hass.callService('time', 'set_value', {
                entity_id: this._entities.time.entity_id,
                time: time
            });
        }
    }

    _toggleAlarm() {
        if (!this._entities.enabled) return;

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
        if (this._entities.snoozeButton) {
            this._hass.callService('button', 'press', {
                entity_id: this._entities.snoozeButton.entity_id
            });
        }
    }

    _dismissAlarm() {
        if (this._entities.dismissButton) {
            this._hass.callService('button', 'press', {
                entity_id: this._entities.dismissButton.entity_id
            });
        }
    }

    getCardSize() {
        return 6;
    }
}

class AlarmClockCardEditor extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    setConfig(config) {
        this._config = config;
    }

    set hass(hass) {
        this._hass = hass;
        this._render();
    }

    _render() {
        if (!this._hass) return;

        const entities = Object.keys(this._hass.states).filter(eid => 
            eid.startsWith('alarm_clock.')
        );

        this.shadowRoot.innerHTML = `
            <style>
                .card-config {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                }
                .form-group {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }
                label {
                    font-weight: 500;
                    color: var(--primary-text-color);
                }
                select, input {
                    padding: 8px;
                    border: 1px solid var(--divider-color);
                    border-radius: 4px;
                    background: var(--card-background-color);
                    color: var(--primary-text-color);
                }
                .switch-group {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                .switch-group label {
                    margin: 0;
                }
            </style>
            
            <div class="card-config">
                <div class="form-group">
                    <label for="entity">Entity (Required)</label>
                    <select id="entity" .value="${this._config.entity || ''}" @change="${this._valueChanged}">
                        <option value="">Select entity...</option>
                        ${entities.map(entity => `
                            <option value="${entity}" ${entity === this._config.entity ? 'selected' : ''}>
                                ${entity}
                            </option>
                        `).join('')}
                    </select>
                </div>

                <div class="form-group">
                    <label for="name">Name (Optional)</label>
                    <input type="text" id="name" .value="${this._config.name || ''}" @input="${this._valueChanged}" placeholder="Alarm Clock">
                </div>

                <div class="form-group">
                    <div class="switch-group">
                        <input type="checkbox" id="show_time_picker" .checked="${this._config.show_time_picker !== false}" @change="${this._valueChanged}">
                        <label for="show_time_picker">Show time picker</label>
                    </div>
                </div>

                <div class="form-group">
                    <div class="switch-group">
                        <input type="checkbox" id="show_days" .checked="${this._config.show_days !== false}" @change="${this._valueChanged}">
                        <label for="show_days">Show day toggles</label>
                    </div>
                </div>

                <div class="form-group">
                    <div class="switch-group">
                        <input type="checkbox" id="show_scripts" .checked="${this._config.show_scripts !== false}" @change="${this._valueChanged}">
                        <label for="show_scripts">Show scripts info</label>
                    </div>
                </div>

                <div class="form-group">
                    <div class="switch-group">
                        <input type="checkbox" id="show_snooze_info" .checked="${this._config.show_snooze_info !== false}" @change="${this._valueChanged}">
                        <label for="show_snooze_info">Show snooze info</label>
                    </div>
                </div>
            </div>
        `;

        this.shadowRoot.querySelectorAll('input, select').forEach(el => {
            el.addEventListener('change', this._valueChanged.bind(this));
            el.addEventListener('input', this._valueChanged.bind(this));
        });
    }

    _valueChanged(ev) {
        if (!this._config || !this._hass) return;

        const target = ev.target;
        const configValue = target.id;
        let value = target.value;

        if (target.type === 'checkbox') {
            value = target.checked;
        }

        this._config = {
            ...this._config,
            [configValue]: value,
        };

        const event = new CustomEvent('config-changed', {
            detail: { config: this._config },
            bubbles: true,
            composed: true,
        });
        this.dispatchEvent(event);
    }
}

customElements.define('alarm-clock-card', AlarmClockCard);
customElements.define('alarm-clock-card-editor', AlarmClockCardEditor);

// Register the card
window.customCards = window.customCards || [];
window.customCards.push({
    type: 'alarm-clock-card',
    name: 'Alarm Clock Card',
    description: 'A card for displaying and controlling alarm clock entities',
    preview: true,
    documentationURL: 'https://github.com/your-username/alarm-clock',
});

console.info(
    '%c  ALARM-CLOCK-CARD  %c  Version 1.0.0  ',
    'color: orange; font-weight: bold; background: black',
    'color: white; font-weight: bold; background: dimgray'
);
