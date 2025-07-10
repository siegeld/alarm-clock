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
  @state() private _searchValue = '';
  @state() private _showDropdown = false;
  @state() private _filteredDevices: any[] = [];
  @state() private _allDevices: any[] = [];

  public setConfig(config: AlarmClockCardConfig): void {
    this._config = config;
  }

  get _device_id(): string {
    return this._config?.device_id || '';
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
          <label>Alarm Clock Device (Required)</label>
          <div class="device-picker">
            <input
              type="text"
              class="device-input"
              placeholder="Search for alarm clock device..."
              .value=${this._searchValue}
              @input=${this._handleSearch}
              @focus=${this._showResults}
              @blur=${this._hideResults}
            />
            <div class="results-dropdown" ?hidden=${!this._showDropdown}>
              ${this._filteredDevices.map(device => html`
                <div class="result-item" @click=${() => this._selectDevice(device)}>
                  <div class="device-name">${device.name}</div>
                  <div class="device-info">Device ID: ${device.id}</div>
                </div>
              `)}
            </div>
          </div>
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

  private async _loadDevices(): Promise<void> {
    if (!this.hass) return;
    
    try {
      // Get device registry from Home Assistant
      const deviceRegistry = await this.hass.callWS({
        type: 'config/device_registry/list'
      }) as any[];
      
      // Filter devices by alarm clock integration
      this._allDevices = deviceRegistry.filter((device: any) => 
        device.manufacturer === 'Alarm Clock Integration' ||
        device.model === 'Alarm Clock' ||
        (device.name && device.name.toLowerCase().includes('alarm'))
      ).map((device: any) => ({
        id: device.id,
        name: device.name_by_user || device.name || `Device ${device.id.substring(0, 8)}`,
        manufacturer: device.manufacturer,
        model: device.model
      }));
      
      this._filteredDevices = this._allDevices;
    } catch (error) {
      console.error('Failed to load device registry:', error);
      this._allDevices = [];
      this._filteredDevices = [];
    }
  }

  private _handleSearch(ev: Event): void {
    const target = ev.target as HTMLInputElement;
    const query = target.value.toLowerCase();
    this._searchValue = target.value;
    
    if (query.length === 0) {
      this._filteredDevices = this._allDevices;
    } else {
      this._filteredDevices = this._allDevices.filter(device =>
        device.name.toLowerCase().includes(query) ||
        device.id.toLowerCase().includes(query)
      );
    }
    
    this._showDropdown = true;
  }

  private _showResults(): void {
    if (this._allDevices.length === 0) {
      this._loadDevices();
    }
    this._showDropdown = true;
  }

  private _hideResults(): void {
    // Add small delay to allow clicks on dropdown items
    setTimeout(() => {
      this._showDropdown = false;
    }, 150);
  }

  private _selectDevice(device: any): void {
    this._searchValue = device.name;
    this._showDropdown = false;
    
    this._config = {
      ...this._config,
      device_id: device.id,
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

      .device-picker {
        position: relative;
        width: 100%;
      }

      .device-input {
        width: 100%;
        padding: 8px 12px;
        border: 1px solid var(--divider-color);
        border-radius: 4px;
        font-size: 14px;
        background: var(--card-background-color);
        color: var(--primary-text-color);
        box-sizing: border-box;
      }

      .device-input:focus {
        outline: none;
        border-color: var(--primary-color);
      }

      .results-dropdown {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: var(--card-background-color);
        border: 1px solid var(--divider-color);
        border-top: none;
        border-radius: 0 0 4px 4px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        max-height: 200px;
        overflow-y: auto;
        z-index: 999;
      }

      .result-item {
        padding: 12px;
        cursor: pointer;
        border-bottom: 1px solid var(--divider-color);
        transition: background-color 0.2s;
      }

      .result-item:hover {
        background-color: var(--secondary-background-color);
      }

      .result-item:last-child {
        border-bottom: none;
      }

      .device-name {
        font-weight: 500;
        color: var(--primary-text-color);
        margin-bottom: 2px;
      }

      .device-info {
        font-size: 12px;
        color: var(--secondary-text-color);
      }
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'alarm-clock-card-editor': AlarmClockCardEditor;
  }
}
