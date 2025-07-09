import {
  LitElement,
  html,
  css,
  CSSResultGroup,
  TemplateResult,
  PropertyValues,
} from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { fireEvent, LovelaceCardEditor, LovelaceCard } from 'custom-card-helpers';

import type {
  HomeAssistant,
  LovelaceCardConfig,
  ActionConfig,
} from 'custom-card-helpers';

export interface AlarmClockCardConfig extends LovelaceCardConfig {
  type: string;
  device_id: string;
  name?: string;
  show_time_picker?: boolean;
  show_days?: boolean;
  show_scripts?: boolean;
  show_snooze_info?: boolean;
  theme?: string;
  tap_action?: ActionConfig;
  hold_action?: ActionConfig;
  double_tap_action?: ActionConfig;
}

interface AlarmClockEntities {
  main?: any;
  time?: any;
  enabled?: any;
  status?: any;
  nextAlarm?: any;
  timeUntil?: any;
  snoozeButton?: any;
  dismissButton?: any;
  days: { [key: string]: any };
}

@customElement('alarm-clock-card')
export class AlarmClockCard extends LitElement implements LovelaceCard {
  public static async getConfigElement(): Promise<LovelaceCardEditor> {
    return document.createElement('alarm-clock-card-editor') as LovelaceCardEditor;
  }

  public static getStubConfig(): AlarmClockCardConfig {
    return {
      type: 'custom:alarm-clock-card',
      device_id: '',
      name: 'Alarm Clock',
      show_time_picker: true,
      show_days: true,
      show_scripts: true,
      show_snooze_info: true,
    };
  }

  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private config!: AlarmClockCardConfig;
  @state() private entities: AlarmClockEntities = { days: {} };

  public setConfig(config: AlarmClockCardConfig): void {
    if (!config.device_id) {
      throw new Error('You need to define a device');
    }

    this.config = {
      show_time_picker: true,
      show_days: true,
      show_scripts: true,
      show_snooze_info: true,
      ...config,
    };
  }

  protected shouldUpdate(changedProps: PropertyValues): boolean {
    if (!this.config) {
      return false;
    }

    if (changedProps.has('config')) {
      return true;
    }

    if (changedProps.has('hass')) {
      this._updateEntities();
      return true;
    }

    return false;
  }

  protected async firstUpdated(): Promise<void> {
    await this._updateEntities();
  }

  private async _updateEntities(): Promise<void> {
    if (!this.hass || !this.config.device_id) return;

    try {
      console.log('🔍 ALARM CARD: Starting robust entity discovery for device:', this.config.device_id);
      
      // Get entity registry to find which entities belong to this device
      const entityRegistry = await this.hass.callWS({
        type: 'config/entity_registry/list'
      }) as any[];

      // Filter entities by device_id from registry
      const deviceEntityEntries = entityRegistry.filter(entry => 
        entry.device_id === this.config.device_id
      );

      console.log('🔍 ALARM CARD: Found device entity entries:', deviceEntityEntries.length);

      // Initialize entities structure
      this.entities = {
        main: undefined,
        time: undefined,
        enabled: undefined,
        status: undefined,
        nextAlarm: undefined,
        timeUntil: undefined,
        snoozeButton: undefined,
        dismissButton: undefined,
        days: {},
      };

      // Days of the week for matching
      const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

      // Map entities by their registry info and unique_id patterns (name-independent)
      deviceEntityEntries.forEach(entry => {
        const entity = this.hass.states[entry.entity_id];
        if (!entity) {
          console.warn('🔍 ALARM CARD: Entity not found in states:', entry.entity_id);
          return;
        }
        
        console.log(`🔍 ALARM CARD: Processing ${entry.platform}.${entry.entity_id} (unique_id: ${entry.unique_id})`);
        
        // Use platform and domain to classify entities robustly
        if (entry.platform === 'alarm_clock') {
          // Main alarm clock sensor - should be the primary one without specific suffixes
          if (entry.entity_id.startsWith('sensor.') && 
              !entry.unique_id.includes('_status') && 
              !entry.unique_id.includes('_next_alarm') && 
              !entry.unique_id.includes('_time_until')) {
            this.entities.main = entity;
            console.log('✅ ALARM CARD: Found main sensor:', entry.entity_id, 'unique_id:', entry.unique_id);
          }
          
          // Time entity
          else if (entry.entity_id.startsWith('time.')) {
            this.entities.time = entity;
            console.log('✅ ALARM CARD: Found time entity:', entry.entity_id, 'unique_id:', entry.unique_id);
          }
          
          // Main alarm enabled switch - ends with "_enabled" but not pre/post alarm
          else if (entry.entity_id.startsWith('switch.') && 
                   entry.unique_id.endsWith('_enabled') && 
                   !entry.unique_id.includes('_pre_alarm_') && 
                   !entry.unique_id.includes('_post_alarm_')) {
            this.entities.enabled = entity;
            console.log('✅ ALARM CARD: Found enabled switch:', entry.entity_id, 'unique_id:', entry.unique_id);
          }
          
          // Status sensor
          else if (entry.entity_id.startsWith('sensor.') && entry.unique_id.includes('_status')) {
            this.entities.status = entity;
            console.log('✅ ALARM CARD: Found status sensor:', entry.entity_id, 'unique_id:', entry.unique_id);
          }
          
          // Next alarm sensor
          else if (entry.entity_id.startsWith('sensor.') && entry.unique_id.includes('_next_alarm')) {
            this.entities.nextAlarm = entity;
            console.log('✅ ALARM CARD: Found next alarm sensor:', entry.entity_id, 'unique_id:', entry.unique_id);
          }
          
          // Time until alarm sensor
          else if (entry.entity_id.startsWith('sensor.') && entry.unique_id.includes('_time_until')) {
            this.entities.timeUntil = entity;
            console.log('✅ ALARM CARD: Found time until sensor:', entry.entity_id, 'unique_id:', entry.unique_id);
          }
          
          // Snooze button
          else if (entry.entity_id.startsWith('button.') && entry.unique_id.includes('_snooze')) {
            this.entities.snoozeButton = entity;
            console.log('✅ ALARM CARD: Found snooze button:', entry.entity_id, 'unique_id:', entry.unique_id);
          }
          
          // Dismiss button
          else if (entry.entity_id.startsWith('button.') && entry.unique_id.includes('_dismiss')) {
            this.entities.dismissButton = entity;
            console.log('✅ ALARM CARD: Found dismiss button:', entry.entity_id, 'unique_id:', entry.unique_id);
          }
          
          // Day switches - match by unique_id ending with day names
          else if (entry.entity_id.startsWith('switch.')) {
            days.forEach(day => {
              if (entry.unique_id.endsWith(`_${day}`)) {
                this.entities.days[day] = entity;
                console.log(`✅ ALARM CARD: Found day switch for ${day}:`, entry.entity_id, 'unique_id:', entry.unique_id);
              }
            });
          }
        }
      });

      console.log('🔍 ALARM CARD: Final entity mapping:', {
        main: this.entities.main?.entity_id,
        time: this.entities.time?.entity_id,
        enabled: this.entities.enabled?.entity_id,
        status: this.entities.status?.entity_id,
        nextAlarm: this.entities.nextAlarm?.entity_id,
        timeUntil: this.entities.timeUntil?.entity_id,
        snoozeButton: this.entities.snoozeButton?.entity_id,
        dismissButton: this.entities.dismissButton?.entity_id,
        days: Object.keys(this.entities.days).reduce((acc, day) => {
          acc[day] = this.entities.days[day]?.entity_id;
          return acc;
        }, {} as Record<string, string>)
      });

    } catch (error) {
      console.error('❌ ALARM CARD: Error loading entity registry:', error);
    }
  }

  protected render(): TemplateResult {
    if (!this.config || !this.entities.main) {
      return html`
        <ha-card>
          <div class="warning">Device not available: ${this.config?.device_id}</div>
        </ha-card>
      `;
    }

    const main = this.entities.main;
    const timeEntity = this.entities.time;
    const enabledEntity = this.entities.enabled;
    const statusEntity = this.entities.status;
    const nextAlarmEntity = this.entities.nextAlarm;
    const timeUntilEntity = this.entities.timeUntil;

    const alarmTime = timeEntity?.state || '07:00';
    const isEnabled = enabledEntity?.state === 'on';
    const status = statusEntity?.state || 'off';
    const nextAlarm = nextAlarmEntity?.attributes?.next_alarm_time;
    const nextAlarmDay = nextAlarmEntity?.attributes?.next_alarm_day;
    const timeUntil = timeUntilEntity?.attributes?.human_readable;
    const countdownType = timeUntilEntity?.attributes?.countdown_type;

    console.log('🎯 ALARM CARD: Rendering with state:', {
      alarmTime,
      isEnabled,
      status,
      nextAlarm,
      nextAlarmDay,
      timeUntil,
      countdownType,
      mainState: main.state,
      mainAttributes: main.attributes,
      enabledState: enabledEntity?.state,
      dayStates: Object.keys(this.entities.days).reduce((acc, day) => {
        acc[day] = this.entities.days[day]?.state;
        return acc;
      }, {} as Record<string, string>)
    });

    return html`
      <ha-card>
        <div class="card-content">
          <div class="header">
            <div class="title">${this.config.name || 'Alarm Clock'}</div>
            <div class="status ${status}">${status}</div>
          </div>

          <div class="time-display">
            <div class="alarm-time">${alarmTime}</div>
            ${nextAlarm
              ? html`<div class="next-alarm">Next alarm: ${nextAlarmDay} ${nextAlarm}</div>`
              : html``}
            ${timeUntil
              ? html`
                  <div class="countdown">
                    <span class="countdown-label">
                      ${countdownType === 'snooze' ? 'Snooze ends in:' : 'Alarm in:'}
                    </span>
                    <span class="countdown-time">${timeUntil}</span>
                  </div>
                `
              : html``}
          </div>

          ${this.config.show_time_picker ? this._renderTimePicker(alarmTime) : html``}
          ${this._renderControls(isEnabled, status)}
          ${this.config.show_days ? this._renderDays() : html``}
          ${this.config.show_scripts ? this._renderScriptsInfo() : html``}
          ${this.config.show_snooze_info && status === 'snoozed' ? this._renderSnoozeInfo() : html``}
        </div>
      </ha-card>
    `;
  }

  private _renderTimePicker(alarmTime: string): TemplateResult {
    return html`
      <div class="time-picker">
        <input
          type="time"
          class="time-input"
          id="alarm-time-input"
          .value=${alarmTime}
          @change=${this._onTimeInputChange}
        />
        <mwc-button
          @click=${this._onSetTimeButtonClick}
          class="set-time-button"
        >
          Set Time
        </mwc-button>
      </div>
    `;
  }

  private _renderControls(isEnabled: boolean, status: string): TemplateResult {
    return html`
      <div class="controls">
        <mwc-button
          raised
          class="control-button ${isEnabled ? 'danger' : 'primary'}"
          @click=${this._toggleAlarm}
        >
          ${isEnabled ? 'Disable' : 'Enable'} Alarm
        </mwc-button>
        ${status === 'ringing'
          ? html`
              <mwc-button
                outlined
                class="control-button secondary"
                @click=${this._snoozeAlarm}
              >
                Snooze
              </mwc-button>
              <mwc-button
                raised
                class="control-button danger"
                @click=${this._dismissAlarm}
              >
                Dismiss
              </mwc-button>
            `
          : html``}
      </div>
    `;
  }

  private _renderDays(): TemplateResult {
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    return html`
      <div class="days-grid">
        ${days.map(
          (day, index) => {
            const dayEntity = this.entities.days[day];
            const isActive = dayEntity?.state === 'on';

            return html`
              <mwc-button
                class="day-button ${isActive ? 'active' : ''}"
                @click=${() => this._toggleDay(day)}
              >
                ${dayLabels[index]}
              </mwc-button>
            `;
          }
        )}
      </div>
    `;
  }

  private _renderScriptsInfo(): TemplateResult {
    const main = this.entities.main;
    if (!main?.attributes) return html``;

    const scripts: Array<{ label: string; value: string }> = [];

    if (main.attributes.pre_alarm_enabled && main.attributes.pre_alarm_script) {
      scripts.push({
        label: 'Pre-alarm',
        value: `${main.attributes.pre_alarm_script} (${main.attributes.pre_alarm_minutes}m before)`,
      });
    }

    if (main.attributes.alarm_script) {
      scripts.push({
        label: 'Alarm',
        value: main.attributes.alarm_script,
      });
    }

    if (main.attributes.post_alarm_enabled && main.attributes.post_alarm_script) {
      scripts.push({
        label: 'Post-alarm',
        value: `${main.attributes.post_alarm_script} (${main.attributes.post_alarm_minutes}m after)`,
      });
    }

    if (scripts.length === 0) return html``;

    return html`
      <div class="scripts-info">
        <div class="scripts-title">Configured Scripts</div>
        ${scripts.map(
          script => html`
            <div class="script-item">
              <span class="script-label">${script.label}:</span>
              <span class="script-value">${script.value}</span>
            </div>
          `
        )}
      </div>
    `;
  }

  private _renderSnoozeInfo(): TemplateResult {
    const main = this.entities.main;
    if (!main?.attributes) return html``;

    const snoozeCount = main.attributes.snooze_count || 0;
    const maxSnoozes = main.attributes.max_snoozes || 3;
    const snoozeUntil = main.attributes.snooze_until;

    return html`
      <div class="snooze-info">
        <div>Snoozed (${snoozeCount}/${maxSnoozes})</div>
        ${snoozeUntil
          ? html`<div>Until: ${new Date(snoozeUntil).toLocaleTimeString()}</div>`
          : html``}
      </div>
    `;
  }

  private _onTimeInputChange(ev: Event): void {
    // Auto-save when user changes the time input
    const input = ev.target as HTMLInputElement;
    const time = input.value;
    this._setAlarmTime(time);
  }

  private _onSetTimeButtonClick(ev: Event): void {
    // Get the time from the input field when button is clicked
    const timeInput = this.shadowRoot?.querySelector('#alarm-time-input') as HTMLInputElement;
    if (timeInput) {
      const time = timeInput.value;
      this._setAlarmTime(time);
    }
  }

  private _setAlarmTime(time: string): void {
    console.log('⏰ ALARM CARD: Setting alarm time to:', time);
    if (!time || !this.entities.time) {
      console.error('⏰ ALARM CARD: Cannot set time - missing time or time entity:', { time, timeEntity: this.entities.time?.entity_id });
      return;
    }

    console.log('⏰ ALARM CARD: Calling time.set_value service:', {
      entity_id: this.entities.time.entity_id,
      time: time,
    });

    this.hass.callService('time', 'set_value', {
      entity_id: this.entities.time.entity_id,
      time: time,
    });
  }

  private _toggleAlarm(): void {
    console.log('🔘 ALARM CARD: Toggle alarm button clicked');
    if (!this.entities.enabled) {
      console.error('🔘 ALARM CARD: Cannot toggle alarm - no enabled entity found');
      return;
    }

    const currentState = this.entities.enabled.state;
    const service = currentState === 'on' ? 'turn_off' : 'turn_on';
    
    console.log('🔘 ALARM CARD: Toggling alarm:', {
      entityId: this.entities.enabled.entity_id,
      currentState,
      service,
    });

    this.hass.callService('switch', service, {
      entity_id: this.entities.enabled.entity_id,
    });
  }

  private _toggleDay(day: string): void {
    console.log('📅 ALARM CARD: Toggle day clicked:', day);
    const dayEntity = this.entities.days[day];
    if (!dayEntity) {
      console.error('📅 ALARM CARD: Cannot toggle day - no entity found for:', day);
      return;
    }

    const currentState = dayEntity.state;
    const service = currentState === 'on' ? 'turn_off' : 'turn_on';
    
    console.log('📅 ALARM CARD: Toggling day:', {
      day,
      entityId: dayEntity.entity_id,
      currentState,
      service,
    });

    this.hass.callService('switch', service, {
      entity_id: dayEntity.entity_id,
    });
  }

  private _snoozeAlarm(): void {
    console.log('💤 ALARM CARD: Snooze button clicked');
    if (this.entities.snoozeButton) {
      console.log('💤 ALARM CARD: Pressing snooze button:', this.entities.snoozeButton.entity_id);
      this.hass.callService('button', 'press', {
        entity_id: this.entities.snoozeButton.entity_id,
      });
    } else {
      console.error('💤 ALARM CARD: Cannot snooze - no snooze button entity found');
    }
  }

  private _dismissAlarm(): void {
    console.log('🛑 ALARM CARD: Dismiss button clicked');
    if (this.entities.dismissButton) {
      console.log('🛑 ALARM CARD: Pressing dismiss button:', this.entities.dismissButton.entity_id);
      this.hass.callService('button', 'press', {
        entity_id: this.entities.dismissButton.entity_id,
      });
    } else {
      console.error('🛑 ALARM CARD: Cannot dismiss - no dismiss button entity found');
    }
  }

  public getCardSize(): number {
    return 6;
  }

  static get styles(): CSSResultGroup {
    return css`
      :host {
        display: block;
      }

      ha-card {
        height: 100%;
      }

      .card-content {
        padding: 24px;
      }

      .warning {
        display: block;
        color: var(--error-color);
        font-weight: 500;
        padding: 16px;
        text-align: center;
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

      .status.off {
        background: var(--error-color);
        color: white;
      }
      .status.armed {
        background: var(--success-color);
        color: white;
      }
      .status.ringing {
        background: var(--warning-color);
        color: white;
        animation: blink 1s infinite;
      }
      .status.snoozed {
        background: var(--info-color);
        color: white;
      }

      @keyframes blink {
        0%,
        50% {
          opacity: 1;
        }
        51%,
        100% {
          opacity: 0.3;
        }
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

      .set-time-button {
        --mdc-theme-primary: var(--primary-color);
        --mdc-theme-on-primary: var(--text-primary-color);
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
      }

      .control-button.primary {
        --mdc-theme-primary: var(--primary-color);
        --mdc-theme-on-primary: var(--text-primary-color);
      }

      .control-button.secondary {
        --mdc-theme-primary: var(--secondary-text-color);
        --mdc-theme-on-primary: var(--primary-text-color);
      }

      .control-button.danger {
        --mdc-theme-primary: var(--error-color);
        --mdc-theme-on-primary: white;
      }

      .days-grid {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: 8px;
        margin: 20px 0;
      }

      .day-button {
        --mdc-theme-primary: var(--secondary-background-color);
        --mdc-theme-on-primary: var(--secondary-text-color);
        min-width: unset;
        height: 32px;
        font-size: 12px;
      }

      .day-button.active {
        --mdc-theme-primary: var(--primary-color);
        --mdc-theme-on-primary: var(--text-primary-color);
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
        background: var(--warning-color);
        color: white;
        border-radius: 8px;
        text-align: center;
      }

      @media (max-width: 600px) {
        .card-content {
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
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'alarm-clock-card': AlarmClockCard;
  }
}

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
  `%c  ALARM-CLOCK-CARD  %c  Version 1.0.0  `,
  'color: orange; font-weight: bold; background: black',
  'color: white; font-weight: bold; background: dimgray'
);
