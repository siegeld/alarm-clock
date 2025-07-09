"use strict";(self.webpackChunkalarm_clock_card=self.webpackChunkalarm_clock_card||[]).push([[526],{526:(e,i,t)=>{t.r(i),t.d(i,{AlarmClockCardEditor:()=>r});var s=t(568),a=t(4),o=t(859),c=function(e,i,t,s){var a,o=arguments.length,c=o<3?i:null===s?s=Object.getOwnPropertyDescriptor(i,t):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)c=Reflect.decorate(e,i,t,s);else for(var r=e.length-1;r>=0;r--)(a=e[r])&&(c=(o<3?a(c):o>3?a(i,t,c):a(i,t))||c);return o>3&&c&&Object.defineProperty(i,t,c),c};let r=class extends s.LitElement{setConfig(e){this._config=e}get _entity(){return this._config?.entity||""}get _name(){return this._config?.name||""}get _show_time_picker(){return!1!==this._config?.show_time_picker}get _show_days(){return!1!==this._config?.show_days}get _show_scripts(){return!1!==this._config?.show_scripts}get _show_snooze_info(){return!1!==this._config?.show_snooze_info}render(){if(!this.hass||!this._config)return s.html``;const e=Object.keys(this.hass.states).filter(e=>e.startsWith("alarm_clock."));return s.html`
      <div class="card-config">
        <div class="side-by-side">
          <paper-dropdown-menu
            label="Entity (Required)"
            @value-changed=${this._valueChanged}
            .configValue=${"entity"}
            class="dropdown"
          >
            <paper-listbox slot="dropdown-content" .selected=${e.indexOf(this._entity)}>
              ${e.map(e=>s.html`
                  <paper-item .value=${e}>${e}</paper-item>
                `)}
            </paper-listbox>
          </paper-dropdown-menu>
        </div>

        <div class="side-by-side">
          <paper-input
            label="Name (Optional)"
            .value=${this._name}
            .configValue=${"name"}
            @value-changed=${this._valueChanged}
          ></paper-input>
        </div>

        <div class="switches">
          <h3>Display Options</h3>
          
          <div class="switch-wrapper">
            <ha-switch
              aria-label="Show time picker"
              .checked=${this._show_time_picker}
              .configValue=${"show_time_picker"}
              @change=${this._valueChanged}
            ></ha-switch>
            <div class="switch-label">Show time picker</div>
          </div>

          <div class="switch-wrapper">
            <ha-switch
              aria-label="Show day toggles"
              .checked=${this._show_days}
              .configValue=${"show_days"}
              @change=${this._valueChanged}
            ></ha-switch>
            <div class="switch-label">Show day toggles</div>
          </div>

          <div class="switch-wrapper">
            <ha-switch
              aria-label="Show scripts info"
              .checked=${this._show_scripts}
              .configValue=${"show_scripts"}
              @change=${this._valueChanged}
            ></ha-switch>
            <div class="switch-label">Show scripts info</div>
          </div>

          <div class="switch-wrapper">
            <ha-switch
              aria-label="Show snooze info"
              .checked=${this._show_snooze_info}
              .configValue=${"show_snooze_info"}
              @change=${this._valueChanged}
            ></ha-switch>
            <div class="switch-label">Show snooze info when snoozed</div>
          </div>
        </div>
      </div>
    `}_valueChanged(e){if(!this._config||!this.hass)return;const i=e.target,t=i.configValue;if(this[`_${t}`]===i.value)return;let s;s="checkbox"===i.type?i.checked:i.value,t&&(this._config={...this._config,[t]:s}),(0,o.fireEvent)(this,"config-changed",{config:this._config})}static get styles(){return s.css`
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
    `}};c([(0,a.MZ)({attribute:!1})],r.prototype,"hass",void 0),c([(0,a.wk)()],r.prototype,"_config",void 0),c([(0,a.wk)()],r.prototype,"_helpers",void 0),r=c([(0,a.EM)("alarm-clock-card-editor")],r)}}]);