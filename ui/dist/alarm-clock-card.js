/*! For license information please see alarm-clock-card.js.LICENSE.txt */
(()=>{"use strict";const t=window,e=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,i=Symbol(),s=new WeakMap;class n{constructor(t,e,s){if(this._$cssResult$=!0,s!==i)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const i=this.t;if(e&&void 0===t){const e=void 0!==i&&1===i.length;e&&(t=s.get(i)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&s.set(i,t))}return t}toString(){return this.cssText}}const o=(t,...e)=>{const s=1===t.length?t[0]:e.reduce((e,i,s)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[s+1],t[0]);return new n(s,t,i)},r=e?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new n("string"==typeof t?t:t+"",void 0,i))(e)})(t):t;var a;const l=window,c=l.trustedTypes,h=c?c.emptyScript:"",d=l.reactiveElementPolyfillSupport,p={toAttribute(t,e){switch(e){case Boolean:t=t?h:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},u=(t,e)=>e!==t&&(e==e||t==t),m={attribute:!0,type:String,converter:p,reflect:!1,hasChanged:u},_="finalized";class f extends HTMLElement{constructor(){super(),this._$Ei=new Map,this.isUpdatePending=!1,this.hasUpdated=!1,this._$El=null,this._$Eu()}static addInitializer(t){var e;this.finalize(),(null!==(e=this.h)&&void 0!==e?e:this.h=[]).push(t)}static get observedAttributes(){this.finalize();const t=[];return this.elementProperties.forEach((e,i)=>{const s=this._$Ep(i,e);void 0!==s&&(this._$Ev.set(s,i),t.push(s))}),t}static createProperty(t,e=m){if(e.state&&(e.attribute=!1),this.finalize(),this.elementProperties.set(t,e),!e.noAccessor&&!this.prototype.hasOwnProperty(t)){const i="symbol"==typeof t?Symbol():"__"+t,s=this.getPropertyDescriptor(t,i,e);void 0!==s&&Object.defineProperty(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){return{get(){return this[e]},set(s){const n=this[t];this[e]=s,this.requestUpdate(t,n,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)||m}static finalize(){if(this.hasOwnProperty(_))return!1;this[_]=!0;const t=Object.getPrototypeOf(this);if(t.finalize(),void 0!==t.h&&(this.h=[...t.h]),this.elementProperties=new Map(t.elementProperties),this._$Ev=new Map,this.hasOwnProperty("properties")){const t=this.properties,e=[...Object.getOwnPropertyNames(t),...Object.getOwnPropertySymbols(t)];for(const i of e)this.createProperty(i,t[i])}return this.elementStyles=this.finalizeStyles(this.styles),!0}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(r(t))}else void 0!==t&&e.push(r(t));return e}static _$Ep(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}_$Eu(){var t;this._$E_=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$Eg(),this.requestUpdate(),null===(t=this.constructor.h)||void 0===t||t.forEach(t=>t(this))}addController(t){var e,i;(null!==(e=this._$ES)&&void 0!==e?e:this._$ES=[]).push(t),void 0!==this.renderRoot&&this.isConnected&&(null===(i=t.hostConnected)||void 0===i||i.call(t))}removeController(t){var e;null===(e=this._$ES)||void 0===e||e.splice(this._$ES.indexOf(t)>>>0,1)}_$Eg(){this.constructor.elementProperties.forEach((t,e)=>{this.hasOwnProperty(e)&&(this._$Ei.set(e,this[e]),delete this[e])})}createRenderRoot(){var i;const s=null!==(i=this.shadowRoot)&&void 0!==i?i:this.attachShadow(this.constructor.shadowRootOptions);return((i,s)=>{e?i.adoptedStyleSheets=s.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet):s.forEach(e=>{const s=document.createElement("style"),n=t.litNonce;void 0!==n&&s.setAttribute("nonce",n),s.textContent=e.cssText,i.appendChild(s)})})(s,this.constructor.elementStyles),s}connectedCallback(){var t;void 0===this.renderRoot&&(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),null===(t=this._$ES)||void 0===t||t.forEach(t=>{var e;return null===(e=t.hostConnected)||void 0===e?void 0:e.call(t)})}enableUpdating(t){}disconnectedCallback(){var t;null===(t=this._$ES)||void 0===t||t.forEach(t=>{var e;return null===(e=t.hostDisconnected)||void 0===e?void 0:e.call(t)})}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$EO(t,e,i=m){var s;const n=this.constructor._$Ep(t,i);if(void 0!==n&&!0===i.reflect){const o=(void 0!==(null===(s=i.converter)||void 0===s?void 0:s.toAttribute)?i.converter:p).toAttribute(e,i.type);this._$El=t,null==o?this.removeAttribute(n):this.setAttribute(n,o),this._$El=null}}_$AK(t,e){var i;const s=this.constructor,n=s._$Ev.get(t);if(void 0!==n&&this._$El!==n){const t=s.getPropertyOptions(n),o="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==(null===(i=t.converter)||void 0===i?void 0:i.fromAttribute)?t.converter:p;this._$El=n,this[n]=o.fromAttribute(e,t.type),this._$El=null}}requestUpdate(t,e,i){let s=!0;void 0!==t&&(((i=i||this.constructor.getPropertyOptions(t)).hasChanged||u)(this[t],e)?(this._$AL.has(t)||this._$AL.set(t,e),!0===i.reflect&&this._$El!==t&&(void 0===this._$EC&&(this._$EC=new Map),this._$EC.set(t,i))):s=!1),!this.isUpdatePending&&s&&(this._$E_=this._$Ej())}async _$Ej(){this.isUpdatePending=!0;try{await this._$E_}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;this.hasUpdated,this._$Ei&&(this._$Ei.forEach((t,e)=>this[e]=t),this._$Ei=void 0);let e=!1;const i=this._$AL;try{e=this.shouldUpdate(i),e?(this.willUpdate(i),null===(t=this._$ES)||void 0===t||t.forEach(t=>{var e;return null===(e=t.hostUpdate)||void 0===e?void 0:e.call(t)}),this.update(i)):this._$Ek()}catch(t){throw e=!1,this._$Ek(),t}e&&this._$AE(i)}willUpdate(t){}_$AE(t){var e;null===(e=this._$ES)||void 0===e||e.forEach(t=>{var e;return null===(e=t.hostUpdated)||void 0===e?void 0:e.call(t)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$Ek(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$E_}shouldUpdate(t){return!0}update(t){void 0!==this._$EC&&(this._$EC.forEach((t,e)=>this._$EO(e,this[e],t)),this._$EC=void 0),this._$Ek()}updated(t){}firstUpdated(t){}}var g;f[_]=!0,f.elementProperties=new Map,f.elementStyles=[],f.shadowRootOptions={mode:"open"},null==d||d({ReactiveElement:f}),(null!==(a=l.reactiveElementVersions)&&void 0!==a?a:l.reactiveElementVersions=[]).push("1.6.3");const v=window,y=v.trustedTypes,$=y?y.createPolicy("lit-html",{createHTML:t=>t}):void 0,b="$lit$",w=`lit$${(Math.random()+"").slice(9)}$`,A="?"+w,x=`<${A}>`,S=document,E=()=>S.createComment(""),k=t=>null===t||"object"!=typeof t&&"function"!=typeof t,C=Array.isArray,z="[ \t\n\f\r]",P=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,U=/-->/g,O=/>/g,R=RegExp(`>|${z}(?:([^\\s"'>=/]+)(${z}*=${z}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),T=/'/g,H=/"/g,N=/^(?:script|style|textarea|title)$/i,M=t=>(e,...i)=>({_$litType$:t,strings:e,values:i}),D=M(1),j=(M(2),Symbol.for("lit-noChange")),L=Symbol.for("lit-nothing"),B=new WeakMap,I=S.createTreeWalker(S,129,null,!1);function V(t,e){if(!Array.isArray(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==$?$.createHTML(e):e}const W=(t,e)=>{const i=t.length-1,s=[];let n,o=2===e?"<svg>":"",r=P;for(let e=0;e<i;e++){const i=t[e];let a,l,c=-1,h=0;for(;h<i.length&&(r.lastIndex=h,l=r.exec(i),null!==l);)h=r.lastIndex,r===P?"!--"===l[1]?r=U:void 0!==l[1]?r=O:void 0!==l[2]?(N.test(l[2])&&(n=RegExp("</"+l[2],"g")),r=R):void 0!==l[3]&&(r=R):r===R?">"===l[0]?(r=null!=n?n:P,c=-1):void 0===l[1]?c=-2:(c=r.lastIndex-l[2].length,a=l[1],r=void 0===l[3]?R:'"'===l[3]?H:T):r===H||r===T?r=R:r===U||r===O?r=P:(r=R,n=void 0);const d=r===R&&t[e+1].startsWith("/>")?" ":"";o+=r===P?i+x:c>=0?(s.push(a),i.slice(0,c)+b+i.slice(c)+w+d):i+w+(-2===c?(s.push(void 0),e):d)}return[V(t,o+(t[i]||"<?>")+(2===e?"</svg>":"")),s]};class K{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let n=0,o=0;const r=t.length-1,a=this.parts,[l,c]=W(t,e);if(this.el=K.createElement(l,i),I.currentNode=this.el.content,2===e){const t=this.el.content,e=t.firstChild;e.remove(),t.append(...e.childNodes)}for(;null!==(s=I.nextNode())&&a.length<r;){if(1===s.nodeType){if(s.hasAttributes()){const t=[];for(const e of s.getAttributeNames())if(e.endsWith(b)||e.startsWith(w)){const i=c[o++];if(t.push(e),void 0!==i){const t=s.getAttribute(i.toLowerCase()+b).split(w),e=/([.?@])?(.*)/.exec(i);a.push({type:1,index:n,name:e[2],strings:t,ctor:"."===e[1]?Y:"?"===e[1]?Q:"@"===e[1]?X:Z})}else a.push({type:6,index:n})}for(const e of t)s.removeAttribute(e)}if(N.test(s.tagName)){const t=s.textContent.split(w),e=t.length-1;if(e>0){s.textContent=y?y.emptyScript:"";for(let i=0;i<e;i++)s.append(t[i],E()),I.nextNode(),a.push({type:2,index:++n});s.append(t[e],E())}}}else if(8===s.nodeType)if(s.data===A)a.push({type:2,index:n});else{let t=-1;for(;-1!==(t=s.data.indexOf(w,t+1));)a.push({type:7,index:n}),t+=w.length-1}n++}}static createElement(t,e){const i=S.createElement("template");return i.innerHTML=t,i}}function q(t,e,i=t,s){var n,o,r,a;if(e===j)return e;let l=void 0!==s?null===(n=i._$Co)||void 0===n?void 0:n[s]:i._$Cl;const c=k(e)?void 0:e._$litDirective$;return(null==l?void 0:l.constructor)!==c&&(null===(o=null==l?void 0:l._$AO)||void 0===o||o.call(l,!1),void 0===c?l=void 0:(l=new c(t),l._$AT(t,i,s)),void 0!==s?(null!==(r=(a=i)._$Co)&&void 0!==r?r:a._$Co=[])[s]=l:i._$Cl=l),void 0!==l&&(e=q(t,l._$AS(t,e.values),l,s)),e}class F{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){var e;const{el:{content:i},parts:s}=this._$AD,n=(null!==(e=null==t?void 0:t.creationScope)&&void 0!==e?e:S).importNode(i,!0);I.currentNode=n;let o=I.nextNode(),r=0,a=0,l=s[0];for(;void 0!==l;){if(r===l.index){let e;2===l.type?e=new J(o,o.nextSibling,this,t):1===l.type?e=new l.ctor(o,l.name,l.strings,this,t):6===l.type&&(e=new tt(o,this,t)),this._$AV.push(e),l=s[++a]}r!==(null==l?void 0:l.index)&&(o=I.nextNode(),r++)}return I.currentNode=S,n}v(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class J{constructor(t,e,i,s){var n;this.type=2,this._$AH=L,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cp=null===(n=null==s?void 0:s.isConnected)||void 0===n||n}get _$AU(){var t,e;return null!==(e=null===(t=this._$AM)||void 0===t?void 0:t._$AU)&&void 0!==e?e:this._$Cp}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===(null==t?void 0:t.nodeType)&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=q(this,t,e),k(t)?t===L||null==t||""===t?(this._$AH!==L&&this._$AR(),this._$AH=L):t!==this._$AH&&t!==j&&this._(t):void 0!==t._$litType$?this.g(t):void 0!==t.nodeType?this.$(t):(t=>C(t)||"function"==typeof(null==t?void 0:t[Symbol.iterator]))(t)?this.T(t):this._(t)}k(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}$(t){this._$AH!==t&&(this._$AR(),this._$AH=this.k(t))}_(t){this._$AH!==L&&k(this._$AH)?this._$AA.nextSibling.data=t:this.$(S.createTextNode(t)),this._$AH=t}g(t){var e;const{values:i,_$litType$:s}=t,n="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=K.createElement(V(s.h,s.h[0]),this.options)),s);if((null===(e=this._$AH)||void 0===e?void 0:e._$AD)===n)this._$AH.v(i);else{const t=new F(n,this),e=t.u(this.options);t.v(i),this.$(e),this._$AH=t}}_$AC(t){let e=B.get(t.strings);return void 0===e&&B.set(t.strings,e=new K(t)),e}T(t){C(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,s=0;for(const n of t)s===e.length?e.push(i=new J(this.k(E()),this.k(E()),this,this.options)):i=e[s],i._$AI(n),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){var i;for(null===(i=this._$AP)||void 0===i||i.call(this,!1,!0,e);t&&t!==this._$AB;){const e=t.nextSibling;t.remove(),t=e}}setConnected(t){var e;void 0===this._$AM&&(this._$Cp=t,null===(e=this._$AP)||void 0===e||e.call(this,t))}}class Z{constructor(t,e,i,s,n){this.type=1,this._$AH=L,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=n,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=L}get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}_$AI(t,e=this,i,s){const n=this.strings;let o=!1;if(void 0===n)t=q(this,t,e,0),o=!k(t)||t!==this._$AH&&t!==j,o&&(this._$AH=t);else{const s=t;let r,a;for(t=n[0],r=0;r<n.length-1;r++)a=q(this,s[i+r],e,r),a===j&&(a=this._$AH[r]),o||(o=!k(a)||a!==this._$AH[r]),a===L?t=L:t!==L&&(t+=(null!=a?a:"")+n[r+1]),this._$AH[r]=a}o&&!s&&this.j(t)}j(t){t===L?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,null!=t?t:"")}}class Y extends Z{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===L?void 0:t}}const G=y?y.emptyScript:"";class Q extends Z{constructor(){super(...arguments),this.type=4}j(t){t&&t!==L?this.element.setAttribute(this.name,G):this.element.removeAttribute(this.name)}}class X extends Z{constructor(t,e,i,s,n){super(t,e,i,s,n),this.type=5}_$AI(t,e=this){var i;if((t=null!==(i=q(this,t,e,0))&&void 0!==i?i:L)===j)return;const s=this._$AH,n=t===L&&s!==L||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,o=t!==L&&(s===L||n);n&&this.element.removeEventListener(this.name,this,s),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e,i;"function"==typeof this._$AH?this._$AH.call(null!==(i=null===(e=this.options)||void 0===e?void 0:e.host)&&void 0!==i?i:this.element,t):this._$AH.handleEvent(t)}}class tt{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){q(this,t)}}const et=v.litHtmlPolyfillSupport;var it,st;null==et||et(K,J),(null!==(g=v.litHtmlVersions)&&void 0!==g?g:v.litHtmlVersions=[]).push("2.8.0");class nt extends f{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var t,e;const i=super.createRenderRoot();return null!==(t=(e=this.renderOptions).renderBefore)&&void 0!==t||(e.renderBefore=i.firstChild),i}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{var s,n;const o=null!==(s=null==i?void 0:i.renderBefore)&&void 0!==s?s:e;let r=o._$litPart$;if(void 0===r){const t=null!==(n=null==i?void 0:i.renderBefore)&&void 0!==n?n:null;o._$litPart$=r=new J(e.insertBefore(E(),t),t,void 0,null!=i?i:{})}return r._$AI(t),r})(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),null===(t=this._$Do)||void 0===t||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),null===(t=this._$Do)||void 0===t||t.setConnected(!1)}render(){return j}}nt.finalized=!0,nt._$litElement$=!0,null===(it=globalThis.litElementHydrateSupport)||void 0===it||it.call(globalThis,{LitElement:nt});const ot=globalThis.litElementPolyfillSupport;null==ot||ot({LitElement:nt}),(null!==(st=globalThis.litElementVersions)&&void 0!==st?st:globalThis.litElementVersions=[]).push("3.3.3");const rt=t=>e=>"function"==typeof e?((t,e)=>(customElements.define(t,e),e))(t,e):((t,e)=>{const{kind:i,elements:s}=e;return{kind:i,elements:s,finisher(e){customElements.define(t,e)}}})(t,e),at=(t,e)=>"method"===e.kind&&e.descriptor&&!("value"in e.descriptor)?{...e,finisher(i){i.createProperty(e.key,t)}}:{kind:"field",key:Symbol(),placement:"own",descriptor:{},originalKey:e.key,initializer(){"function"==typeof e.initializer&&(this[e.key]=e.initializer.call(this))},finisher(i){i.createProperty(e.key,t)}};function lt(t){return(e,i)=>void 0!==i?((t,e,i)=>{e.constructor.createProperty(i,t)})(t,e,i):at(t,e)}function ct(t){return lt({...t,state:!0})}var ht;null===(ht=window.HTMLSlotElement)||void 0===ht||ht.prototype.assignedElements;var dt=function(t,e,i,s){var n,o=arguments.length,r=o<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,e,i,s);else for(var a=t.length-1;a>=0;a--)(n=t[a])&&(r=(o<3?n(r):o>3?n(e,i,r):n(e,i))||r);return o>3&&r&&Object.defineProperty(e,i,r),r};let pt=class extends nt{constructor(){super(...arguments),this.entities={days:{}}}static async getConfigElement(){return document.createElement("alarm-clock-card-editor")}static getStubConfig(){return{type:"custom:alarm-clock-card",entity:"",name:"Alarm Clock",show_time_picker:!0,show_days:!0,show_scripts:!0,show_snooze_info:!0}}setConfig(t){if(!t.entity)throw new Error("You need to define an entity");this.config={show_time_picker:!0,show_days:!0,show_scripts:!0,show_snooze_info:!0,...t}}shouldUpdate(t){return!(!this.config||!t.has("config")&&(!t.has("hass")||(this._updateEntities(),0)))}_updateEntities(){if(!this.hass||!this.config.entity)return;const t=this.config.entity,e=t.replace("alarm_clock.","");this.entities={main:this.hass.states[t],time:this.hass.states[`time.${e}_time`],enabled:this.hass.states[`switch.${e}_alarm_enabled`],status:this.hass.states[`sensor.${e}_status`],nextAlarm:this.hass.states[`sensor.${e}_next_alarm`],timeUntil:this.hass.states[`sensor.${e}_time_until_alarm`],snoozeButton:this.hass.states[`button.${e}_snooze`],dismissButton:this.hass.states[`button.${e}_dismiss`],days:{}},["monday","tuesday","wednesday","thursday","friday","saturday","sunday"].forEach(t=>{this.entities.days[t]=this.hass.states[`switch.${e}_${t}`]})}render(){if(!this.config||!this.entities.main)return D`
        <ha-card>
          <div class="warning">Entity not available: ${this.config?.entity}</div>
        </ha-card>
      `;this.entities.main;const t=this.entities.time,e=this.entities.enabled,i=this.entities.status,s=this.entities.nextAlarm,n=this.entities.timeUntil,o=t?.state||"07:00",r="on"===e?.state,a=i?.state||"off",l=s?.attributes?.next_alarm_time,c=s?.attributes?.next_alarm_day,h=n?.attributes?.human_readable,d=n?.attributes?.countdown_type;return D`
      <ha-card>
        <div class="card-content">
          <div class="header">
            <div class="title">${this.config.name||"Alarm Clock"}</div>
            <div class="status ${a}">${a}</div>
          </div>

          <div class="time-display">
            <div class="alarm-time">${o}</div>
            ${l?D`<div class="next-alarm">Next alarm: ${c} ${l}</div>`:D``}
            ${h?D`
                  <div class="countdown">
                    <span class="countdown-label">
                      ${"snooze"===d?"Snooze ends in:":"Alarm in:"}
                    </span>
                    <span class="countdown-time">${h}</span>
                  </div>
                `:D``}
          </div>

          ${this.config.show_time_picker?this._renderTimePicker(o):D``}
          ${this._renderControls(r,a)}
          ${this.config.show_days?this._renderDays():D``}
          ${this.config.show_scripts?this._renderScriptsInfo():D``}
          ${this.config.show_snooze_info&&"snoozed"===a?this._renderSnoozeInfo():D``}
        </div>
      </ha-card>
    `}_renderTimePicker(t){return D`
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
    `}_renderControls(t,e){return D`
      <div class="controls">
        <mwc-button
          raised
          class="control-button ${t?"danger":"primary"}"
          @click=${this._toggleAlarm}
        >
          ${t?"Disable":"Enable"} Alarm
        </mwc-button>
        ${"ringing"===e?D`
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
            `:D``}
      </div>
    `}_renderDays(){const t=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];return D`
      <div class="days-grid">
        ${["monday","tuesday","wednesday","thursday","friday","saturday","sunday"].map((e,i)=>{const s=this.entities.days[e];return D`
              <mwc-button
                class="day-button ${"on"===s?.state?"active":""}"
                @click=${()=>this._toggleDay(e)}
              >
                ${t[i]}
              </mwc-button>
            `})}
      </div>
    `}_renderScriptsInfo(){const t=this.entities.main;if(!t?.attributes)return D``;const e=[];return t.attributes.pre_alarm_enabled&&t.attributes.pre_alarm_script&&e.push({label:"Pre-alarm",value:`${t.attributes.pre_alarm_script} (${t.attributes.pre_alarm_minutes}m before)`}),t.attributes.alarm_script&&e.push({label:"Alarm",value:t.attributes.alarm_script}),t.attributes.post_alarm_enabled&&t.attributes.post_alarm_script&&e.push({label:"Post-alarm",value:`${t.attributes.post_alarm_script} (${t.attributes.post_alarm_minutes}m after)`}),0===e.length?D``:D`
      <div class="scripts-info">
        <div class="scripts-title">Configured Scripts</div>
        ${e.map(t=>D`
            <div class="script-item">
              <span class="script-label">${t.label}:</span>
              <span class="script-value">${t.value}</span>
            </div>
          `)}
      </div>
    `}_renderSnoozeInfo(){const t=this.entities.main;if(!t?.attributes)return D``;const e=t.attributes.snooze_count||0,i=t.attributes.max_snoozes||3,s=t.attributes.snooze_until;return D`
      <div class="snooze-info">
        <div>Snoozed (${e}/${i})</div>
        ${s?D`<div>Until: ${new Date(s).toLocaleTimeString()}</div>`:D``}
      </div>
    `}_setAlarmTime(t){const e=t.target.value;this.entities.time&&this.hass.callService("time","set_value",{entity_id:this.entities.time.entity_id,time:e})}_toggleAlarm(){if(!this.entities.enabled)return;const t="on"===this.entities.enabled.state?"turn_off":"turn_on";this.hass.callService("switch",t,{entity_id:this.entities.enabled.entity_id})}_toggleDay(t){const e=this.entities.days[t];if(!e)return;const i="on"===e.state?"turn_off":"turn_on";this.hass.callService("switch",i,{entity_id:e.entity_id})}_snoozeAlarm(){this.entities.snoozeButton&&this.hass.callService("button","press",{entity_id:this.entities.snoozeButton.entity_id})}_dismissAlarm(){this.entities.dismissButton&&this.hass.callService("button","press",{entity_id:this.entities.dismissButton.entity_id})}getCardSize(){return 6}static get styles(){return o`
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
    `}};var ut,mt,_t;dt([lt({attribute:!1})],pt.prototype,"hass",void 0),dt([ct()],pt.prototype,"config",void 0),dt([ct()],pt.prototype,"entities",void 0),pt=dt([rt("alarm-clock-card")],pt),window.customCards=window.customCards||[],window.customCards.push({type:"alarm-clock-card",name:"Alarm Clock Card",description:"A card for displaying and controlling alarm clock entities",preview:!0,documentationURL:"https://github.com/your-username/alarm-clock"}),console.info("%c  ALARM-CLOCK-CARD  %c  Version 1.0.0  ","color: orange; font-weight: bold; background: black","color: white; font-weight: bold; background: dimgray"),(_t=ut||(ut={})).language="language",_t.system="system",_t.comma_decimal="comma_decimal",_t.decimal_comma="decimal_comma",_t.space_comma="space_comma",_t.none="none",function(t){t.language="language",t.system="system",t.am_pm="12",t.twenty_four="24"}(mt||(mt={})),new Set(["fan","input_boolean","light","switch","group","automation"]);var ft=function(t,e,i,s){s=s||{},i=null==i?{}:i;var n=new Event(e,{bubbles:void 0===s.bubbles||s.bubbles,cancelable:Boolean(s.cancelable),composed:void 0===s.composed||s.composed});return n.detail=i,t.dispatchEvent(n),n};new Set(["call-service","divider","section","weblink","cast","select"]);var gt=function(t,e,i,s){var n,o=arguments.length,r=o<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,e,i,s);else for(var a=t.length-1;a>=0;a--)(n=t[a])&&(r=(o<3?n(r):o>3?n(e,i,r):n(e,i))||r);return o>3&&r&&Object.defineProperty(e,i,r),r};let vt=class extends nt{setConfig(t){this._config=t}get _entity(){return this._config?.entity||""}get _name(){return this._config?.name||""}get _show_time_picker(){return!1!==this._config?.show_time_picker}get _show_days(){return!1!==this._config?.show_days}get _show_scripts(){return!1!==this._config?.show_scripts}get _show_snooze_info(){return!1!==this._config?.show_snooze_info}render(){return this.hass&&this._config?D`
      <div class="card-config">
        <div class="option">
          <label>Entity (Required)</label>
          <ha-entity-picker
            .hass=${this.hass}
            .value=${this._entity}
            .includeDomains=${["sensor"]}
            .entityFilter=${t=>t.entity_id.includes("alarm_clock")||"alarm_clock"===t.attributes?.device_class}
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
              @change=${t=>this._toggleChanged("show_time_picker",t)}
            ></ha-switch>
          </ha-formfield>
          
          <ha-formfield label="Show day toggles">
            <ha-switch
              .checked=${this._show_days}
              @change=${t=>this._toggleChanged("show_days",t)}
            ></ha-switch>
          </ha-formfield>
          
          <ha-formfield label="Show scripts info">
            <ha-switch
              .checked=${this._show_scripts}
              @change=${t=>this._toggleChanged("show_scripts",t)}
            ></ha-switch>
          </ha-formfield>
          
          <ha-formfield label="Show snooze info when snoozed">
            <ha-switch
              .checked=${this._show_snooze_info}
              @change=${t=>this._toggleChanged("show_snooze_info",t)}
            ></ha-switch>
          </ha-formfield>
        </div>
      </div>
    `:D``}_entityChanged(t){if(!this._config||!this.hass)return;const e=t.detail.value;this._config={...this._config,entity:e},ft(this,"config-changed",{config:this._config})}_nameChanged(t){if(!this._config||!this.hass)return;const e=t.target.value;this._config={...this._config,name:e},ft(this,"config-changed",{config:this._config})}_toggleChanged(t,e){if(!this._config||!this.hass)return;const i=e.target.checked;this._config={...this._config,[t]:i},ft(this,"config-changed",{config:this._config})}_valueChanged(t){if(!this._config||!this.hass)return;const e=t.target,i=e.configValue;if(this[`_${i}`]===e.value)return;let s;s="checkbox"===e.type?e.checked:e.value,i&&(this._config={...this._config,[i]:s}),ft(this,"config-changed",{config:this._config})}static get styles(){return o`
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
    `}};gt([lt({attribute:!1})],vt.prototype,"hass",void 0),gt([ct()],vt.prototype,"_config",void 0),gt([ct()],vt.prototype,"_helpers",void 0),vt=gt([rt("alarm-clock-card-editor")],vt),console.info("%c  ALARM-CLOCK-CARD  %c  Version 1.0.0  ","color: orange; font-weight: bold; background: black","color: white; font-weight: bold; background: dimgray")})();