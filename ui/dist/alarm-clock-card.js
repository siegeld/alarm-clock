/*! For license information please see alarm-clock-card.js.LICENSE.txt */
(()=>{"use strict";var t,e,r={4:(t,e,r)=>{r.d(e,{EM:()=>i,MZ:()=>s,wk:()=>n});const i=t=>e=>"function"==typeof e?((t,e)=>(customElements.define(t,e),e))(t,e):((t,e)=>{const{kind:r,elements:i}=e;return{kind:r,elements:i,finisher(e){customElements.define(t,e)}}})(t,e),o=(t,e)=>"method"===e.kind&&e.descriptor&&!("value"in e.descriptor)?{...e,finisher(r){r.createProperty(e.key,t)}}:{kind:"field",key:Symbol(),placement:"own",descriptor:{},originalKey:e.key,initializer(){"function"==typeof e.initializer&&(this[e.key]=e.initializer.call(this))},finisher(r){r.createProperty(e.key,t)}},a=(t,e,r)=>{e.constructor.createProperty(r,t)};function s(t){return(e,r)=>void 0!==r?a(t,e,r):o(t,e)}function n(t){return s({...t,state:!0})}var c;null===(c=window.HTMLSlotElement)||void 0===c||c.prototype.assignedElements},568:t=>{t.exports=lit},859:t=>{t.exports=customCardHelpers}},i={};function o(t){var e=i[t];if(void 0!==e)return e.exports;var a=i[t]={exports:{}};return r[t](a,a.exports,o),a.exports}o.m=r,o.n=t=>{var e=t&&t.__esModule?()=>t.default:()=>t;return o.d(e,{a:e}),e},o.d=(t,e)=>{for(var r in e)o.o(e,r)&&!o.o(t,r)&&Object.defineProperty(t,r,{enumerable:!0,get:e[r]})},o.f={},o.e=t=>Promise.all(Object.keys(o.f).reduce((e,r)=>(o.f[r](t,e),e),[])),o.u=t=>t+".alarm-clock-card.js",o.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(t){if("object"==typeof window)return window}}(),o.o=(t,e)=>Object.prototype.hasOwnProperty.call(t,e),t={},e="alarm-clock-card:",o.l=(r,i,a,s)=>{if(t[r])t[r].push(i);else{var n,c;if(void 0!==a)for(var l=document.getElementsByTagName("script"),d=0;d<l.length;d++){var m=l[d];if(m.getAttribute("src")==r||m.getAttribute("data-webpack")==e+a){n=m;break}}n||(c=!0,(n=document.createElement("script")).charset="utf-8",n.timeout=120,o.nc&&n.setAttribute("nonce",o.nc),n.setAttribute("data-webpack",e+a),n.src=r),t[r]=[i];var p=(e,i)=>{n.onerror=n.onload=null,clearTimeout(u);var o=t[r];if(delete t[r],n.parentNode&&n.parentNode.removeChild(n),o&&o.forEach(t=>t(i)),e)return e(i)},u=setTimeout(p.bind(null,void 0,{type:"timeout",target:n}),12e4);n.onerror=p.bind(null,n.onerror),n.onload=p.bind(null,n.onload),c&&document.head.appendChild(n)}},o.r=t=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},(()=>{var t;o.g.importScripts&&(t=o.g.location+"");var e=o.g.document;if(!t&&e&&(e.currentScript&&"SCRIPT"===e.currentScript.tagName.toUpperCase()&&(t=e.currentScript.src),!t)){var r=e.getElementsByTagName("script");if(r.length)for(var i=r.length-1;i>-1&&(!t||!/^http(s?):/.test(t));)t=r[i--].src}if(!t)throw new Error("Automatic publicPath is not supported in this browser");t=t.replace(/^blob:/,"").replace(/#.*$/,"").replace(/\?.*$/,"").replace(/\/[^\/]+$/,"/"),o.p=t})(),(()=>{var t={792:0};o.f.j=(e,r)=>{var i=o.o(t,e)?t[e]:void 0;if(0!==i)if(i)r.push(i[2]);else{var a=new Promise((r,o)=>i=t[e]=[r,o]);r.push(i[2]=a);var s=o.p+o.u(e),n=new Error;o.l(s,r=>{if(o.o(t,e)&&(0!==(i=t[e])&&(t[e]=void 0),i)){var a=r&&("load"===r.type?"missing":r.type),s=r&&r.target&&r.target.src;n.message="Loading chunk "+e+" failed.\n("+a+": "+s+")",n.name="ChunkLoadError",n.type=a,n.request=s,i[1](n)}},"chunk-"+e,e)}};var e=(e,r)=>{var i,a,[s,n,c]=r,l=0;if(s.some(e=>0!==t[e])){for(i in n)o.o(n,i)&&(o.m[i]=n[i]);c&&c(o)}for(e&&e(r);l<s.length;l++)a=s[l],o.o(t,a)&&t[a]&&t[a][0](),t[a]=0},r=self.webpackChunkalarm_clock_card=self.webpackChunkalarm_clock_card||[];r.forEach(e.bind(null,0)),r.push=e.bind(null,r.push.bind(r))})();var a=o(568),s=o(4),n=function(t,e,r,i){var o,a=arguments.length,s=a<3?e:null===i?i=Object.getOwnPropertyDescriptor(e,r):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(t,e,r,i);else for(var n=t.length-1;n>=0;n--)(o=t[n])&&(s=(a<3?o(s):a>3?o(e,r,s):o(e,r))||s);return a>3&&s&&Object.defineProperty(e,r,s),s};let c=class extends a.LitElement{constructor(){super(...arguments),this.entities={days:{}}}static async getConfigElement(){return await o.e(526).then(o.bind(o,526)),document.createElement("alarm-clock-card-editor")}static getStubConfig(){return{type:"custom:alarm-clock-card",entity:"",name:"Alarm Clock",show_time_picker:!0,show_days:!0,show_scripts:!0,show_snooze_info:!0}}setConfig(t){if(!t.entity)throw new Error("You need to define an entity");this.config={show_time_picker:!0,show_days:!0,show_scripts:!0,show_snooze_info:!0,...t}}shouldUpdate(t){return!(!this.config||!t.has("config")&&(!t.has("hass")||(this._updateEntities(),0)))}_updateEntities(){if(!this.hass||!this.config.entity)return;const t=this.config.entity,e=t.replace("alarm_clock.","");this.entities={main:this.hass.states[t],time:this.hass.states[`time.${e}_time`],enabled:this.hass.states[`switch.${e}_alarm_enabled`],status:this.hass.states[`sensor.${e}_status`],nextAlarm:this.hass.states[`sensor.${e}_next_alarm`],timeUntil:this.hass.states[`sensor.${e}_time_until_alarm`],snoozeButton:this.hass.states[`button.${e}_snooze`],dismissButton:this.hass.states[`button.${e}_dismiss`],days:{}},["monday","tuesday","wednesday","thursday","friday","saturday","sunday"].forEach(t=>{this.entities.days[t]=this.hass.states[`switch.${e}_${t}`]})}render(){if(!this.config||!this.entities.main)return a.html`
        <ha-card>
          <div class="warning">Entity not available: ${this.config?.entity}</div>
        </ha-card>
      `;this.entities.main;const t=this.entities.time,e=this.entities.enabled,r=this.entities.status,i=this.entities.nextAlarm,o=this.entities.timeUntil,s=t?.state||"07:00",n="on"===e?.state,c=r?.state||"off",l=i?.attributes?.next_alarm_time,d=i?.attributes?.next_alarm_day,m=o?.attributes?.human_readable,p=o?.attributes?.countdown_type;return a.html`
      <ha-card>
        <div class="card-content">
          <div class="header">
            <div class="title">${this.config.name||"Alarm Clock"}</div>
            <div class="status ${c}">${c}</div>
          </div>

          <div class="time-display">
            <div class="alarm-time">${s}</div>
            ${l?a.html`<div class="next-alarm">Next alarm: ${d} ${l}</div>`:a.html``}
            ${m?a.html`
                  <div class="countdown">
                    <span class="countdown-label">
                      ${"snooze"===p?"Snooze ends in:":"Alarm in:"}
                    </span>
                    <span class="countdown-time">${m}</span>
                  </div>
                `:a.html``}
          </div>

          ${this.config.show_time_picker?this._renderTimePicker(s):a.html``}
          ${this._renderControls(n,c)}
          ${this.config.show_days?this._renderDays():a.html``}
          ${this.config.show_scripts?this._renderScriptsInfo():a.html``}
          ${this.config.show_snooze_info&&"snoozed"===c?this._renderSnoozeInfo():a.html``}
        </div>
      </ha-card>
    `}_renderTimePicker(t){return a.html`
      <div class="time-picker">
        <input
          type="time"
          class="time-input"
          .value=${t}
          @change=${this._setAlarmTime}
        />
        <mwc-button
          @click=${this._setAlarmTime}
          class="set-time-button"
        >
          Set Time
        </mwc-button>
      </div>
    `}_renderControls(t,e){return a.html`
      <div class="controls">
        <mwc-button
          raised
          class="control-button ${t?"danger":"primary"}"
          @click=${this._toggleAlarm}
        >
          ${t?"Disable":"Enable"} Alarm
        </mwc-button>
        ${"ringing"===e?a.html`
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
            `:a.html``}
      </div>
    `}_renderDays(){const t=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];return a.html`
      <div class="days-grid">
        ${["monday","tuesday","wednesday","thursday","friday","saturday","sunday"].map((e,r)=>{const i=this.entities.days[e],o="on"===i?.state;return a.html`
              <mwc-button
                class="day-button ${o?"active":""}"
                @click=${()=>this._toggleDay(e)}
              >
                ${t[r]}
              </mwc-button>
            `})}
      </div>
    `}_renderScriptsInfo(){const t=this.entities.main;if(!t?.attributes)return a.html``;const e=[];return t.attributes.pre_alarm_enabled&&t.attributes.pre_alarm_script&&e.push({label:"Pre-alarm",value:`${t.attributes.pre_alarm_script} (${t.attributes.pre_alarm_minutes}m before)`}),t.attributes.alarm_script&&e.push({label:"Alarm",value:t.attributes.alarm_script}),t.attributes.post_alarm_enabled&&t.attributes.post_alarm_script&&e.push({label:"Post-alarm",value:`${t.attributes.post_alarm_script} (${t.attributes.post_alarm_minutes}m after)`}),0===e.length?a.html``:a.html`
      <div class="scripts-info">
        <div class="scripts-title">Configured Scripts</div>
        ${e.map(t=>a.html`
            <div class="script-item">
              <span class="script-label">${t.label}:</span>
              <span class="script-value">${t.value}</span>
            </div>
          `)}
      </div>
    `}_renderSnoozeInfo(){const t=this.entities.main;if(!t?.attributes)return a.html``;const e=t.attributes.snooze_count||0,r=t.attributes.max_snoozes||3,i=t.attributes.snooze_until;return a.html`
      <div class="snooze-info">
        <div>Snoozed (${e}/${r})</div>
        ${i?a.html`<div>Until: ${new Date(i).toLocaleTimeString()}</div>`:a.html``}
      </div>
    `}_setAlarmTime(t){const e=t.target.value;this.entities.time&&this.hass.callService("time","set_value",{entity_id:this.entities.time.entity_id,time:e})}_toggleAlarm(){if(!this.entities.enabled)return;const t="on"===this.entities.enabled.state?"turn_off":"turn_on";this.hass.callService("switch",t,{entity_id:this.entities.enabled.entity_id})}_toggleDay(t){const e=this.entities.days[t];if(!e)return;const r="on"===e.state?"turn_off":"turn_on";this.hass.callService("switch",r,{entity_id:e.entity_id})}_snoozeAlarm(){this.entities.snoozeButton&&this.hass.callService("button","press",{entity_id:this.entities.snoozeButton.entity_id})}_dismissAlarm(){this.entities.dismissButton&&this.hass.callService("button","press",{entity_id:this.entities.dismissButton.entity_id})}getCardSize(){return 6}static get styles(){return a.css`
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
    `}};n([(0,s.MZ)({attribute:!1})],c.prototype,"hass",void 0),n([(0,s.wk)()],c.prototype,"config",void 0),n([(0,s.wk)()],c.prototype,"entities",void 0),c=n([(0,s.EM)("alarm-clock-card")],c),window.customCards=window.customCards||[],window.customCards.push({type:"alarm-clock-card",name:"Alarm Clock Card",description:"A card for displaying and controlling alarm clock entities",preview:!0,documentationURL:"https://github.com/your-username/alarm-clock"}),console.info("%c  ALARM-CLOCK-CARD  %c  Version 1.0.0  ","color: orange; font-weight: bold; background: black","color: white; font-weight: bold; background: dimgray")})();