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

    const entities = Object.keys(this.hass.states).filter(
      (eid) => eid.startsWith('alarm_clock.')
    );

    return html`
      <div class="card-config">
        <div class="side-by-side">
          <paper-dropdown-menu
            label="Entity (Required)"
            @value-changed=${this._valueChanged}
            .configValue=${'entity'}
            class="dropdown"
          >
            <paper-listbox slot="dropdown-content" .selected=${entities.indexOf(this._entity)}>
              ${entities.map(
                (entity) => html`
                  <paper-item .value=${entity}>${entity}</paper-item>
                `
              )}
            </paper-listbox>
          </paper-dropdown-menu>
        </div>

        <div class="side-by-side">
          <paper-input
            label="Name (Optional)"
            .value=${this._name}
            .configValue=${'name'}
            @value-changed=${this._valueChanged}
          ></paper-input>
        </div>

        <div class="switches">
          <h3>Display Options</h3>
          
          <div class="switch-wrapper">
            <ha-switch
              aria-label="Show time picker"
              .checked=${this._show_time_picker}
              .configValue=${'show_time_picker'}
              @change=${this._valueChanged}
            ></ha-switch>
            <div class="switch-label">Show time picker</div>
          </div>

          <div class="switch-wrapper">
            <ha-switch
              aria-label="Show day toggles"
              .checked=${this._show_days}
              .configValue=${'show_days'}
              @change=${this._valueChanged}
            ></ha-switch>
            <div class="switch-label">Show day toggles</div>
          </div>

          <div class="switch-wrapper">
            <ha-switch
              aria-label="Show scripts info"
              .checked=${this._show_scripts}
              .configValue=${'show_scripts'}
              @change=${this._valueChanged}
            ></ha-switch>
            <div class="switch-label">Show scripts info</div>
          </div>

          <div class="switch-wrapper">
            <ha-switch
              aria-label="Show snooze info"
              .checked=${this._show_snooze_info}
              .configValue=${'show_snooze_info'}
              @change=${this._valueChanged}
            ></ha-switch>
            <div class="switch-label">Show snooze info when snoozed</div>
          </div>
        </div>
      </div>
    `;
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
        gap: 12px;
      }

      .side-by-side {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .side-by-side > * {
        flex: 1;
        min-width: 0;
      }

      .dropdown {
        width: 100%;
      }

      .switches {
        border-top: 1px solid var(--divider-color);
        padding-top: 16px;
      }

      .switches h3 {
        margin: 0 0 16px 0;
        color: var(--primary-text-color);
        font-size: 16px;
        font-weight: 500;
      }

      .switch-wrapper {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 12px;
      }

      .switch-label {
        flex: 1;
        color: var(--primary-text-color);
      }

      ha-switch {
        flex-shrink: 0;
      }

      paper-input,
      paper-dropdown-menu {
        width: 100%;
      }

      paper-item {
        cursor: pointer;
        min-width: 200px;
      }
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'alarm-clock-card-editor': AlarmClockCardEditor;
  }
}
