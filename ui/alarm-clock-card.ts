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
  @state() private entities: {
    main?: any;           // sensor.alarm_clock (main status)
    time?: any;           // time.alarm_clock (alarm time)
    enabled?: any;        // switch.alarm_clock_enabled
    status?: any;         // sensor.alarm_clock_status  
    nextAlarm?: any;      // sensor.alarm_clock_next_alarm
    timeUntil?: any;      // sensor.alarm_clock_time_until_alarm
    days?: {[day: string]: any}; // switch.alarm_clock_monday, etc.
  } = {};

  public setConfig(config: AlarmClockCardConfig): void {
    if (!config.device_id) {
      throw new Error('You need to define a device_id');
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
    console.log('🔍 ALARM CARD: shouldUpdate called', {
      hasConfig: !!this.config,
      hasHass: !!this.hass,
      hasEntities: Object.keys(this.entities).length > 0,
      changedProps: Array.from(changedProps.keys()),
    });

    if (!this.config) {
      console.log('🔍 ALARM CARD: No config, returning false');
      return false;
    }

    // Initialize or refresh entity data when needed
    if (changedProps.has('hass') && this.hass && this.config) {
      if (Object.keys(this.entities).length === 0) {
        console.log('🔍 ALARM CARD: No entities yet, calling _updateEntities');
        this._updateEntities();
      } else {
        console.log('🔍 ALARM CARD: Refreshing entity states');
        this._refreshEntityStates();
      }
    }

    // Let Lit handle change detection based on property changes
    return changedProps.has('config') || changedProps.has('hass') || changedProps.has('entities');
  }

  private _refreshEntityStates(): void {
    // Update all entity states from hass.states
    let hasChanges = false;
    const newEntities = { ...this.entities, days: { ...this.entities.days } };
    
    // Check main entities (time, enabled, status, etc.)
    for (const [key, entity] of Object.entries(this.entities)) {
      if (key === 'days') continue; // Handle days separately
      
      if (entity && entity.entity_id) {
        const freshState = this.hass.states[entity.entity_id];
        if (freshState && (freshState.state !== entity.state || freshState.last_updated !== entity.last_updated)) {
          console.log(`🔍 ALARM CARD: ${key} entity changed:`, entity.state, '→', freshState.state);
          (newEntities as any)[key] = freshState;
          hasChanges = true;
        }
      }
    }
    
    // Check day entities separately
    if (this.entities.days) {
      for (const [day, dayEntity] of Object.entries(this.entities.days)) {
        if (dayEntity && dayEntity.entity_id) {
          const freshState = this.hass.states[dayEntity.entity_id];
          if (freshState && (freshState.state !== dayEntity.state || freshState.last_updated !== dayEntity.last_updated)) {
            console.log(`🔍 ALARM CARD: Day ${day} entity changed:`, dayEntity.state, '→', freshState.state);
            newEntities.days![day] = freshState;
            hasChanges = true;
          }
        }
      }
    }
    
    if (hasChanges) {
      console.log('🔍 ALARM CARD: Changes detected, updating entities object');
      this.entities = newEntities; // This should trigger Lit's reactivity
    }
  }

  private async _updateEntities(): Promise<void> {
    if (!this.hass || !this.config.device_id) {
      console.error('🔍 ALARM CARD: Missing hass or device_id:', {
        hass: !!this.hass,
        device_id: this.config.device_id
      });
      return;
    }

    console.log('🔍 ALARM CARD: Looking for entities for device:', this.config.device_id);

    try {
      // Get entity registry to find entities for this device
      const entityRegistry = await this.hass.callWS({
        type: 'config/entity_registry/list'
      }) as any[];

      console.log('🔍 ALARM CARD: Entity registry loaded, total entities:', entityRegistry.length);

      // Find entities that belong to this device
      const deviceEntities = entityRegistry.filter((entity: any) => 
        entity.device_id === this.config.device_id
      );

      console.log('🔍 ALARM CARD: Found device entities:', deviceEntities.length, deviceEntities);

      // Map entities by type
      const newEntities: typeof this.entities = { days: {} };
      
      console.log('🔍 ALARM CARD: Processing device entities:');
      for (const regEntity of deviceEntities) {
        console.log('🔍 ALARM CARD: Checking entity:', regEntity.entity_id, regEntity);
        
        const entityState = this.hass.states[regEntity.entity_id];
        if (!entityState) {
          console.log('🔍 ALARM CARD: No state found for:', regEntity.entity_id);
          continue;
        }
        
        console.log('🔍 ALARM CARD: Entity state found:', regEntity.entity_id, entityState.state, entityState.attributes);
        
        const entityId = regEntity.entity_id;
        
        if (entityId.startsWith('sensor.') && entityId.includes('alarm_clock') && !entityId.includes('status') && !entityId.includes('next') && !entityId.includes('time_until')) {
          console.log('🔍 ALARM CARD: Found MAIN entity:', entityId);
          newEntities.main = entityState;
        } else if (entityId.startsWith('time.') && entityId.includes('alarm_clock')) {
          console.log('🔍 ALARM CARD: Found TIME entity:', entityId);
          newEntities.time = entityState;
        } else if (entityId.startsWith('switch.') && entityId === 'switch.alarm_clock_enabled') {
          console.log('🔍 ALARM CARD: Found MAIN ENABLED entity:', entityId);
          newEntities.enabled = entityState;
        } else if (entityId.startsWith('sensor.') && entityId.includes('status')) {
          console.log('🔍 ALARM CARD: Found STATUS entity:', entityId);
          newEntities.status = entityState;
        } else if (entityId.startsWith('sensor.') && entityId.includes('next_alarm')) {
          console.log('🔍 ALARM CARD: Found NEXT_ALARM entity:', entityId);
          newEntities.nextAlarm = entityState;
        } else if (entityId.startsWith('sensor.') && entityId.includes('time_until')) {
          console.log('🔍 ALARM CARD: Found TIME_UNTIL entity:', entityId);
          newEntities.timeUntil = entityState;
        } else if (entityId.startsWith('switch.') && entityId.includes('alarm_clock_')) {
          // Day switches: switch.alarm_clock_monday, etc.
          const dayMatch = entityId.match(/alarm_clock_(\w+)$/);
          if (dayMatch && dayMatch[1] !== 'enabled') {
            const day = dayMatch[1];
            if (['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].includes(day)) {
              console.log('🔍 ALARM CARD: Found DAY entity:', entityId, day);
              newEntities.days![day] = entityState;
            }
          }
        } else {
          console.log('🔍 ALARM CARD: Unmatched entity:', entityId);
        }
      }
      
      console.log('🔍 ALARM CARD: Final mapped entities:', newEntities);
      console.log('🔍 ALARM CARD: Entity count - main:', !!newEntities.main, 'time:', !!newEntities.time, 'enabled:', !!newEntities.enabled, 'days:', Object.keys(newEntities.days || {}).length);
      
      this.entities = newEntities;
      
    } catch (error) {
      console.error('🔍 ALARM CARD: Error loading entity registry:', error);
      this.entities = {};
    }
  }

  protected render(): TemplateResult {
    if (!this.config || Object.keys(this.entities).length === 0) {
      return html`
        <ha-card>
          <div class="warning">
            ${!this.config ? 'No configuration' : `Device not available: ${this.config.device_id}`}
          </div>
        </ha-card>
      `;
    }

    // Read data directly from hass.states to ensure fresh data
    const timeEntity = this.entities.time?.entity_id ? this.hass.states[this.entities.time.entity_id] : null;
    const enabledEntity = this.entities.enabled?.entity_id ? this.hass.states[this.entities.enabled.entity_id] : null;
    const mainEntity = this.entities.main?.entity_id ? this.hass.states[this.entities.main.entity_id] : null;
    
    const alarmTimeRaw = timeEntity?.state || '07:00';
    const alarmTime = this._formatTime12Hour(alarmTimeRaw);
    const isEnabled = enabledEntity?.state === 'on';
    
    // Get the actual alarm state from main entity (this is authoritative)
    // The main entity already handles all logic for off/armed/ringing/snoozed states
    const status = mainEntity?.state || 'off';
    
    // Debug the status logic with fresh data
    console.log('🔍 ALARM CARD: Status logic debug (FRESH DATA):', {
      timeEntityId: this.entities.time?.entity_id,
      enabledEntityId: this.entities.enabled?.entity_id,
      mainEntityId: this.entities.main?.entity_id,
      enabledEntityFreshState: enabledEntity?.state,
      mainEntityFreshState: mainEntity?.state,
      isEnabled: isEnabled,
      finalStatus: status,
    });
    
    // Get additional data from sensor entities
    const nextAlarmAttrs = this.entities.nextAlarm?.attributes || {};
    const timeUntilAttrs = this.entities.timeUntil?.attributes || {};
    
    const nextAlarm = this.entities.nextAlarm?.state;
    const nextAlarmDay = nextAlarmAttrs.next_alarm_day;
    const timeUntil = timeUntilAttrs.human_readable;
    const countdownType = timeUntilAttrs.countdown_type;
    
    // Get day states
    const enabledDays = Object.keys(this.entities.days || {}).filter(day => 
      this.entities.days![day]?.state === 'on'
    );

    console.log('🎯 ALARM CARD: Rendering with entity states:', {
      alarmTime,
      isEnabled,
      status,
      nextAlarm,
      nextAlarmDay,
      timeUntil,
      countdownType,
      enabledDays,
      entities: this.entities,
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
            ${nextAlarm && nextAlarmDay
              ? html`<div class="next-alarm">Next alarm: ${nextAlarmDay} at ${new Date(nextAlarm).toLocaleTimeString()}</div>`
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
          ${this.config.show_days ? this._renderDays(enabledDays) : html``}
          ${this.config.show_snooze_info && status === 'snoozed' ? this._renderSnoozeInfo() : html``}
        </div>
      </ha-card>
    `;
  }

  private _renderTimePicker(alarmTime: string): TemplateResult {
    // Use raw 24-hour time for the input field
    const alarmTimeRaw = this.entities.time?.state || '07:00';
    
    return html`
      <div class="time-picker">
        <input
          type="time"
          class="time-input"
          id="alarm-time-input"
          .value=${alarmTimeRaw}
          value=${alarmTimeRaw}
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

  private _renderDays(enabledDays: string[]): TemplateResult {
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    return html`
      <div class="days-grid">
        ${days.map(
          (day, index) => {
            const isActive = enabledDays.includes(day);

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

  private _renderScriptsInfo(attrs: any): TemplateResult {
    const scripts: Array<{ label: string; value: string }> = [];

    if (attrs.pre_alarm_enabled && attrs.pre_alarm_script) {
      scripts.push({
        label: 'Pre-alarm',
        value: `${attrs.pre_alarm_script} (${attrs.pre_alarm_minutes}m before)`,
      });
    }

    if (attrs.alarm_script) {
      scripts.push({
        label: 'Alarm',
        value: attrs.alarm_script,
      });
    }

    if (attrs.post_alarm_enabled && attrs.post_alarm_script) {
      scripts.push({
        label: 'Post-alarm',
        value: `${attrs.post_alarm_script} (${attrs.post_alarm_minutes}m after)`,
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
    const timeUntilAttrs = this.entities.timeUntil?.attributes || {};
    const snoozeCount = timeUntilAttrs.snooze_count || 0;
    const maxSnoozes = this.entities.main?.attributes?.max_snoozes || 3;
    const snoozeUntil = timeUntilAttrs.snooze_until;
    
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
    // Don't auto-save on every keystroke - only when user finishes typing
    // The user can use the "Set Time" button or press Enter
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
      console.error('⏰ ALARM CARD: Cannot set time - missing time or time entity:', { time, entity: this.entities.time?.entity_id });
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
    if (!this.entities.enabled || !this.hass) {
      console.error('🔘 ALARM CARD: Cannot toggle alarm - no enabled switch entity found');
      return;
    }

    const isEnabled = this.entities.enabled.state === 'on';
    const service = isEnabled ? 'turn_off' : 'turn_on';
    
    console.log('🔘 ALARM CARD: Toggling alarm via switch:', {
      switchEntityId: this.entities.enabled.entity_id,
      currentEnabled: isEnabled,
      service,
    });

    this.hass.callService('switch', service, {
      entity_id: this.entities.enabled.entity_id,
    });
  }

  private async _toggleDay(day: string): Promise<void> {
    console.log('📅 ALARM CARD: Toggle day clicked:', day);
    if (!this.entities.days || !this.entities.days[day]) {
      console.error('📅 ALARM CARD: Cannot toggle day - no day switch entity found:', day);
      return;
    }

    const dayEntity = this.entities.days[day];
    const isEnabled = dayEntity.state === 'on';
    const service = isEnabled ? 'turn_off' : 'turn_on';

    console.log('📅 ALARM CARD: Toggling day switch:', {
      day,
      entityId: dayEntity.entity_id,
      currentEnabled: isEnabled,
      service,
    });

    await this.hass.callService('switch', service, {
      entity_id: dayEntity.entity_id,
    });
    
    // Force refresh after service call
    console.log('📅 ALARM CARD: Service call completed, forcing refresh');
    setTimeout(() => this._refreshEntityStates(), 100);
  }

  private _snoozeAlarm(): void {
    console.log('💤 ALARM CARD: Snooze button clicked');
    if (!this.entities.main) {
      console.error('💤 ALARM CARD: Cannot snooze - no main entity found');
      return;
    }

    console.log('💤 ALARM CARD: Calling snooze service:', this.entities.main.entity_id);
    this.hass.callService('alarm_clock', 'snooze', {
      entity_id: this.entities.main.entity_id,
    });
  }

  private _dismissAlarm(): void {
    console.log('🛑 ALARM CARD: Dismiss button clicked');
    if (!this.entities.main) {
      console.error('🛑 ALARM CARD: Cannot dismiss - no main entity found');
      return;
    }

    console.log('🛑 ALARM CARD: Calling dismiss service:', this.entities.main.entity_id);
    this.hass.callService('alarm_clock', 'dismiss', {
      entity_id: this.entities.main.entity_id,
    });
  }

  private _formatTime12Hour(time24: string): string {
    if (!time24 || time24 === 'off') return time24;
    
    try {
      // Parse the 24-hour time (e.g., "07:00" or "20:30")
      const [hoursStr, minutesStr] = time24.split(':');
      const hours24 = parseInt(hoursStr, 10);
      const minutes = parseInt(minutesStr, 10);
      
      // Convert to 12-hour format
      const isPM = hours24 >= 12;
      const hours12 = hours24 === 0 ? 12 : hours24 > 12 ? hours24 - 12 : hours24;
      const ampm = isPM ? 'PM' : 'AM';
      
      // Format without leading zero for hours, but keep it for minutes
      const minutesFormatted = minutes.toString().padStart(2, '0');
      
      return `${hours12}:${minutesFormatted} ${ampm}`;
    } catch (error) {
      // If parsing fails, return original time
      return time24;
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
  `%c  ALARM-CLOCK-CARD  %c  Version 1.1.0  `,
  'color: orange; font-weight: bold; background: black',
  'color: white; font-weight: bold; background: dimgray'
);
