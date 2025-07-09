import {
  LitElement,
  html,
  css,
  CSSResultGroup,
  TemplateResult,
} from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { fireEvent, LovelaceCardEditor } from 'custom-card-helpers';

import type { HomeAssistant } from 'custom-card-helpers';
import { AlarmClockCardConfig } from './alarm-clock-card';

@customElement('alarm-clock-card-editor')
export class AlarmClockCardEditor extends LitElement implements LovelaceCardEditor {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private _config!: AlarmClockCardConfig;
  @state() private _helpers?: any;

  public setConfig(config: AlarmClockCardConfig): void {
    this._config = config;
  }

  get _entity(): string {
    return this._config?.entity || '';
  }

  get _name(): string {
    return this._config?.name || '';
  }

  get _show_time_picker(): boolean {
    return this._config?.show_time_picker !== false;
  }

  get _show_days(): boolean {
    return this._config?.show_days !== false;
  }

  get _show_scripts(): boolean {
    return this._config?.show_scripts !== false;
  }

  get _show_snooze_info(): boolean {
    return this._config?.show_snooze_info !== false;
  }

  protected render(): TemplateResult {
    if (!this.hass || !this._config) {
      return html``;
    }

    return html`
      <div class="card-config">
        <div class="option">
          <label>Entity (Required)</label>
          <ha-entity-picker
            .hass=${this.hass}
            .value=${this._entity}
            .includeDomains=${['sensor']}
            .entityFilter=${(entity) => entity.entity_id.includes('alarm_clock') || entity.attributes?.device_class === 'alarm_clock'}
            allow-custom-entity
            @value-changed=${this._entityChanged}
          ></ha-entity-picker>
        </div>

        <div class="option">
          <label>Card Name (Optional)</label>
          <ha-textfield
            .value=${this._name}
            placeholder="Alarm Clock"
            @input=${this._nameChanged}
          ></ha-textfield>
        </div>

        <div class="option switches-section">
          <label>Display Options</label>
          
          <ha-formfield label="Show time picker">
            <ha-switch
              .checked=${this._show_time_picker}
              @change=${(e: Event) => this._toggleChanged('show_time_picker', e)}
            ></ha-switch>
          </ha-formfield>
          
          <ha-formfield label="Show day toggles">
            <ha-switch
              .checked=${this._show_days}
              @change=${(e: Event) => this._toggleChanged('show_days', e)}
            ></ha-switch>
          </ha-formfield>
          
          <ha-formfield label="Show scripts info">
            <ha-switch
              .checked=${this._show_scripts}
              @change=${(e: Event) => this._toggleChanged('show_scripts', e)}
            ></ha-switch>
          </ha-formfield>
          
          <ha-formfield label="Show snooze info when snoozed">
            <ha-switch
              .checked=${this._show_snooze_info}
              @change=${(e: Event) => this._toggleChanged('show_snooze_info', e)}
            ></ha-switch>
          </ha-formfield>
        </div>
      </div>
    `;
  }

  private _entityChanged(ev: CustomEvent): void {
    if (!this._config || !this.hass) {
      return;
    }
    
    const value = ev.detail.value;
    this._config = {
      ...this._config,
      entity: value,
    };
    
    fireEvent(this, 'config-changed', { config: this._config });
  }

  private _nameChanged(ev: Event): void {
    if (!this._config || !this.hass) {
      return;
    }
    
    const target = ev.target as HTMLInputElement;
    const value = target.value;
    this._config = {
      ...this._config,
      name: value,
    };
    
    fireEvent(this, 'config-changed', { config: this._config });
  }

  private _toggleChanged(key: string, ev: Event): void {
    if (!this._config || !this.hass) {
      return;
    }
    
    const target = ev.target as HTMLInputElement;
    const value = target.checked;
    this._config = {
      ...this._config,
      [key]: value,
    };
    
    fireEvent(this, 'config-changed', { config: this._config });
  }

  private _valueChanged(ev): void {
    if (!this._config || !this.hass) {
      return;
    }

    const target = ev.target;
    const configValue = target.configValue;

    if (this[`_${configValue}`] === target.value) {
      return;
    }

    let value: any;
    if (target.type === 'checkbox') {
      value = target.checked;
    } else {
      value = target.value;
    }

    if (configValue) {
      this._config = {
        ...this._config,
        [configValue]: value,
      };
    }

    fireEvent(this, 'config-changed', { config: this._config });
  }

  static get styles(): CSSResultGroup {
    return css`
      .card-config {
        display: flex;
        flex-direction: column;
        gap: 24px;
        padding: 16px;
      }

      .option {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .option label {
        font-weight: 500;
        font-size: 14px;
        color: var(--primary-text-color);
      }

      ha-entity-picker {
        width: 100%;
      }

      ha-textfield {
        width: 100%;
      }

      ha-formfield {
        display: flex;
        align-items: center;
        margin: 8px 0;
      }

      .switches-section {
        border-top: 1px solid var(--divider-color);
        padding-top: 16px;
      }

      ha-switch {
        flex-shrink: 0;
      }
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'alarm-clock-card-editor': AlarmClockCardEditor;
  }
}
