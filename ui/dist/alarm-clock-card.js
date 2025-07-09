/*! For license information please see alarm-clock-card.js.LICENSE.txt */
(()=>{"use strict";const t=window,e=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,i=Symbol(),s=new WeakMap;class o{constructor(t,e,s){if(this._$cssResult$=!0,s!==i)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const i=this.t;if(e&&void 0===t){const e=void 0!==i&&1===i.length;e&&(t=s.get(i)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&s.set(i,t))}return t}toString(){return this.cssText}}const n=(t,...e)=>{const s=1===t.length?t[0]:e.reduce((e,i,s)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[s+1],t[0]);return new o(s,t,i)},r=e?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new o("string"==typeof t?t:t+"",void 0,i))(e)})(t):t;var a;const l=window,c=l.trustedTypes,d=c?c.emptyScript:"",h=l.reactiveElementPolyfillSupport,u={toAttribute(t,e){switch(e){case Boolean:t=t?d:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},p=(t,e)=>e!==t&&(e==e||t==t),m={attribute:!0,type:String,converter:u,reflect:!1,hasChanged:p},_="finalized";class v extends HTMLElement{constructor(){super(),this._$Ei=new Map,this.isUpdatePending=!1,this.hasUpdated=!1,this._$El=null,this._$Eu()}static addInitializer(t){var e;this.finalize(),(null!==(e=this.h)&&void 0!==e?e:this.h=[]).push(t)}static get observedAttributes(){this.finalize();const t=[];return this.elementProperties.forEach((e,i)=>{const s=this._$Ep(i,e);void 0!==s&&(this._$Ev.set(s,i),t.push(s))}),t}static createProperty(t,e=m){if(e.state&&(e.attribute=!1),this.finalize(),this.elementProperties.set(t,e),!e.noAccessor&&!this.prototype.hasOwnProperty(t)){const i="symbol"==typeof t?Symbol():"__"+t,s=this.getPropertyDescriptor(t,i,e);void 0!==s&&Object.defineProperty(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){return{get(){return this[e]},set(s){const o=this[t];this[e]=s,this.requestUpdate(t,o,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)||m}static finalize(){if(this.hasOwnProperty(_))return!1;this[_]=!0;const t=Object.getPrototypeOf(this);if(t.finalize(),void 0!==t.h&&(this.h=[...t.h]),this.elementProperties=new Map(t.elementProperties),this._$Ev=new Map,this.hasOwnProperty("properties")){const t=this.properties,e=[...Object.getOwnPropertyNames(t),...Object.getOwnPropertySymbols(t)];for(const i of e)this.createProperty(i,t[i])}return this.elementStyles=this.finalizeStyles(this.styles),!0}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(r(t))}else void 0!==t&&e.push(r(t));return e}static _$Ep(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}_$Eu(){var t;this._$E_=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$Eg(),this.requestUpdate(),null===(t=this.constructor.h)||void 0===t||t.forEach(t=>t(this))}addController(t){var e,i;(null!==(e=this._$ES)&&void 0!==e?e:this._$ES=[]).push(t),void 0!==this.renderRoot&&this.isConnected&&(null===(i=t.hostConnected)||void 0===i||i.call(t))}removeController(t){var e;null===(e=this._$ES)||void 0===e||e.splice(this._$ES.indexOf(t)>>>0,1)}_$Eg(){this.constructor.elementProperties.forEach((t,e)=>{this.hasOwnProperty(e)&&(this._$Ei.set(e,this[e]),delete this[e])})}createRenderRoot(){var i;const s=null!==(i=this.shadowRoot)&&void 0!==i?i:this.attachShadow(this.constructor.shadowRootOptions);return((i,s)=>{e?i.adoptedStyleSheets=s.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet):s.forEach(e=>{const s=document.createElement("style"),o=t.litNonce;void 0!==o&&s.setAttribute("nonce",o),s.textContent=e.cssText,i.appendChild(s)})})(s,this.constructor.elementStyles),s}connectedCallback(){var t;void 0===this.renderRoot&&(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),null===(t=this._$ES)||void 0===t||t.forEach(t=>{var e;return null===(e=t.hostConnected)||void 0===e?void 0:e.call(t)})}enableUpdating(t){}disconnectedCallback(){var t;null===(t=this._$ES)||void 0===t||t.forEach(t=>{var e;return null===(e=t.hostDisconnected)||void 0===e?void 0:e.call(t)})}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$EO(t,e,i=m){var s;const o=this.constructor._$Ep(t,i);if(void 0!==o&&!0===i.reflect){const n=(void 0!==(null===(s=i.converter)||void 0===s?void 0:s.toAttribute)?i.converter:u).toAttribute(e,i.type);this._$El=t,null==n?this.removeAttribute(o):this.setAttribute(o,n),this._$El=null}}_$AK(t,e){var i;const s=this.constructor,o=s._$Ev.get(t);if(void 0!==o&&this._$El!==o){const t=s.getPropertyOptions(o),n="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==(null===(i=t.converter)||void 0===i?void 0:i.fromAttribute)?t.converter:u;this._$El=o,this[o]=n.fromAttribute(e,t.type),this._$El=null}}requestUpdate(t,e,i){let s=!0;void 0!==t&&(((i=i||this.constructor.getPropertyOptions(t)).hasChanged||p)(this[t],e)?(this._$AL.has(t)||this._$AL.set(t,e),!0===i.reflect&&this._$El!==t&&(void 0===this._$EC&&(this._$EC=new Map),this._$EC.set(t,i))):s=!1),!this.isUpdatePending&&s&&(this._$E_=this._$Ej())}async _$Ej(){this.isUpdatePending=!0;try{await this._$E_}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;this.hasUpdated,this._$Ei&&(this._$Ei.forEach((t,e)=>this[e]=t),this._$Ei=void 0);let e=!1;const i=this._$AL;try{e=this.shouldUpdate(i),e?(this.willUpdate(i),null===(t=this._$ES)||void 0===t||t.forEach(t=>{var e;return null===(e=t.hostUpdate)||void 0===e?void 0:e.call(t)}),this.update(i)):this._$Ek()}catch(t){throw e=!1,this._$Ek(),t}e&&this._$AE(i)}willUpdate(t){}_$AE(t){var e;null===(e=this._$ES)||void 0===e||e.forEach(t=>{var e;return null===(e=t.hostUpdated)||void 0===e?void 0:e.call(t)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$Ek(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$E_}shouldUpdate(t){return!0}update(t){void 0!==this._$EC&&(this._$EC.forEach((t,e)=>this._$EO(e,this[e],t)),this._$EC=void 0),this._$Ek()}updated(t){}firstUpdated(t){}}var g;v[_]=!0,v.elementProperties=new Map,v.elementStyles=[],v.shadowRootOptions={mode:"open"},null==h||h({ReactiveElement:v}),(null!==(a=l.reactiveElementVersions)&&void 0!==a?a:l.reactiveElementVersions=[]).push("1.6.3");const f=window,y=f.trustedTypes,b=y?y.createPolicy("lit-html",{createHTML:t=>t}):void 0,A="$lit$",$=`lit$${(Math.random()+"").slice(9)}$`,w="?"+$,x=`<${w}>`,C=document,S=()=>C.createComment(""),k=t=>null===t||"object"!=typeof t&&"function"!=typeof t,R=Array.isArray,E="[ \t\n\f\r]",D=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,z=/-->/g,M=/>/g,L=RegExp(`>|${E}(?:([^\\s"'>=/]+)(${E}*=${E}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),P=/'/g,T=/"/g,U=/^(?:script|style|textarea|title)$/i,O=t=>(e,...i)=>({_$litType$:t,strings:e,values:i}),H=O(1),N=(O(2),Symbol.for("lit-noChange")),B=Symbol.for("lit-nothing"),j=new WeakMap,I=C.createTreeWalker(C,129,null,!1);function V(t,e){if(!Array.isArray(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==b?b.createHTML(e):e}const W=(t,e)=>{const i=t.length-1,s=[];let o,n=2===e?"<svg>":"",r=D;for(let e=0;e<i;e++){const i=t[e];let a,l,c=-1,d=0;for(;d<i.length&&(r.lastIndex=d,l=r.exec(i),null!==l);)d=r.lastIndex,r===D?"!--"===l[1]?r=z:void 0!==l[1]?r=M:void 0!==l[2]?(U.test(l[2])&&(o=RegExp("</"+l[2],"g")),r=L):void 0!==l[3]&&(r=L):r===L?">"===l[0]?(r=null!=o?o:D,c=-1):void 0===l[1]?c=-2:(c=r.lastIndex-l[2].length,a=l[1],r=void 0===l[3]?L:'"'===l[3]?T:P):r===T||r===P?r=L:r===z||r===M?r=D:(r=L,o=void 0);const h=r===L&&t[e+1].startsWith("/>")?" ":"";n+=r===D?i+x:c>=0?(s.push(a),i.slice(0,c)+A+i.slice(c)+$+h):i+$+(-2===c?(s.push(void 0),e):h)}return[V(t,n+(t[i]||"<?>")+(2===e?"</svg>":"")),s]};class F{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let o=0,n=0;const r=t.length-1,a=this.parts,[l,c]=W(t,e);if(this.el=F.createElement(l,i),I.currentNode=this.el.content,2===e){const t=this.el.content,e=t.firstChild;e.remove(),t.append(...e.childNodes)}for(;null!==(s=I.nextNode())&&a.length<r;){if(1===s.nodeType){if(s.hasAttributes()){const t=[];for(const e of s.getAttributeNames())if(e.endsWith(A)||e.startsWith($)){const i=c[n++];if(t.push(e),void 0!==i){const t=s.getAttribute(i.toLowerCase()+A).split($),e=/([.?@])?(.*)/.exec(i);a.push({type:1,index:o,name:e[2],strings:t,ctor:"."===e[1]?Y:"?"===e[1]?Q:"@"===e[1]?X:Z})}else a.push({type:6,index:o})}for(const e of t)s.removeAttribute(e)}if(U.test(s.tagName)){const t=s.textContent.split($),e=t.length-1;if(e>0){s.textContent=y?y.emptyScript:"";for(let i=0;i<e;i++)s.append(t[i],S()),I.nextNode(),a.push({type:2,index:++o});s.append(t[e],S())}}}else if(8===s.nodeType)if(s.data===w)a.push({type:2,index:o});else{let t=-1;for(;-1!==(t=s.data.indexOf($,t+1));)a.push({type:7,index:o}),t+=$.length-1}o++}}static createElement(t,e){const i=C.createElement("template");return i.innerHTML=t,i}}function q(t,e,i=t,s){var o,n,r,a;if(e===N)return e;let l=void 0!==s?null===(o=i._$Co)||void 0===o?void 0:o[s]:i._$Cl;const c=k(e)?void 0:e._$litDirective$;return(null==l?void 0:l.constructor)!==c&&(null===(n=null==l?void 0:l._$AO)||void 0===n||n.call(l,!1),void 0===c?l=void 0:(l=new c(t),l._$AT(t,i,s)),void 0!==s?(null!==(r=(a=i)._$Co)&&void 0!==r?r:a._$Co=[])[s]=l:i._$Cl=l),void 0!==l&&(e=q(t,l._$AS(t,e.values),l,s)),e}class K{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){var e;const{el:{content:i},parts:s}=this._$AD,o=(null!==(e=null==t?void 0:t.creationScope)&&void 0!==e?e:C).importNode(i,!0);I.currentNode=o;let n=I.nextNode(),r=0,a=0,l=s[0];for(;void 0!==l;){if(r===l.index){let e;2===l.type?e=new J(n,n.nextSibling,this,t):1===l.type?e=new l.ctor(n,l.name,l.strings,this,t):6===l.type&&(e=new tt(n,this,t)),this._$AV.push(e),l=s[++a]}r!==(null==l?void 0:l.index)&&(n=I.nextNode(),r++)}return I.currentNode=C,o}v(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class J{constructor(t,e,i,s){var o;this.type=2,this._$AH=B,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cp=null===(o=null==s?void 0:s.isConnected)||void 0===o||o}get _$AU(){var t,e;return null!==(e=null===(t=this._$AM)||void 0===t?void 0:t._$AU)&&void 0!==e?e:this._$Cp}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===(null==t?void 0:t.nodeType)&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=q(this,t,e),k(t)?t===B||null==t||""===t?(this._$AH!==B&&this._$AR(),this._$AH=B):t!==this._$AH&&t!==N&&this._(t):void 0!==t._$litType$?this.g(t):void 0!==t.nodeType?this.$(t):(t=>R(t)||"function"==typeof(null==t?void 0:t[Symbol.iterator]))(t)?this.T(t):this._(t)}k(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}$(t){this._$AH!==t&&(this._$AR(),this._$AH=this.k(t))}_(t){this._$AH!==B&&k(this._$AH)?this._$AA.nextSibling.data=t:this.$(C.createTextNode(t)),this._$AH=t}g(t){var e;const{values:i,_$litType$:s}=t,o="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=F.createElement(V(s.h,s.h[0]),this.options)),s);if((null===(e=this._$AH)||void 0===e?void 0:e._$AD)===o)this._$AH.v(i);else{const t=new K(o,this),e=t.u(this.options);t.v(i),this.$(e),this._$AH=t}}_$AC(t){let e=j.get(t.strings);return void 0===e&&j.set(t.strings,e=new F(t)),e}T(t){R(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,s=0;for(const o of t)s===e.length?e.push(i=new J(this.k(S()),this.k(S()),this,this.options)):i=e[s],i._$AI(o),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){var i;for(null===(i=this._$AP)||void 0===i||i.call(this,!1,!0,e);t&&t!==this._$AB;){const e=t.nextSibling;t.remove(),t=e}}setConnected(t){var e;void 0===this._$AM&&(this._$Cp=t,null===(e=this._$AP)||void 0===e||e.call(this,t))}}class Z{constructor(t,e,i,s,o){this.type=1,this._$AH=B,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=o,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=B}get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}_$AI(t,e=this,i,s){const o=this.strings;let n=!1;if(void 0===o)t=q(this,t,e,0),n=!k(t)||t!==this._$AH&&t!==N,n&&(this._$AH=t);else{const s=t;let r,a;for(t=o[0],r=0;r<o.length-1;r++)a=q(this,s[i+r],e,r),a===N&&(a=this._$AH[r]),n||(n=!k(a)||a!==this._$AH[r]),a===B?t=B:t!==B&&(t+=(null!=a?a:"")+o[r+1]),this._$AH[r]=a}n&&!s&&this.j(t)}j(t){t===B?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,null!=t?t:"")}}class Y extends Z{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===B?void 0:t}}const G=y?y.emptyScript:"";class Q extends Z{constructor(){super(...arguments),this.type=4}j(t){t&&t!==B?this.element.setAttribute(this.name,G):this.element.removeAttribute(this.name)}}class X extends Z{constructor(t,e,i,s,o){super(t,e,i,s,o),this.type=5}_$AI(t,e=this){var i;if((t=null!==(i=q(this,t,e,0))&&void 0!==i?i:B)===N)return;const s=this._$AH,o=t===B&&s!==B||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,n=t!==B&&(s===B||o);o&&this.element.removeEventListener(this.name,this,s),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e,i;"function"==typeof this._$AH?this._$AH.call(null!==(i=null===(e=this.options)||void 0===e?void 0:e.host)&&void 0!==i?i:this.element,t):this._$AH.handleEvent(t)}}class tt{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){q(this,t)}}const et=f.litHtmlPolyfillSupport;var it,st;null==et||et(F,J),(null!==(g=f.litHtmlVersions)&&void 0!==g?g:f.litHtmlVersions=[]).push("2.8.0");class ot extends v{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var t,e;const i=super.createRenderRoot();return null!==(t=(e=this.renderOptions).renderBefore)&&void 0!==t||(e.renderBefore=i.firstChild),i}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{var s,o;const n=null!==(s=null==i?void 0:i.renderBefore)&&void 0!==s?s:e;let r=n._$litPart$;if(void 0===r){const t=null!==(o=null==i?void 0:i.renderBefore)&&void 0!==o?o:null;n._$litPart$=r=new J(e.insertBefore(S(),t),t,void 0,null!=i?i:{})}return r._$AI(t),r})(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),null===(t=this._$Do)||void 0===t||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),null===(t=this._$Do)||void 0===t||t.setConnected(!1)}render(){return N}}ot.finalized=!0,ot._$litElement$=!0,null===(it=globalThis.litElementHydrateSupport)||void 0===it||it.call(globalThis,{LitElement:ot});const nt=globalThis.litElementPolyfillSupport;null==nt||nt({LitElement:ot}),(null!==(st=globalThis.litElementVersions)&&void 0!==st?st:globalThis.litElementVersions=[]).push("3.3.3");const rt=t=>e=>"function"==typeof e?((t,e)=>(customElements.define(t,e),e))(t,e):((t,e)=>{const{kind:i,elements:s}=e;return{kind:i,elements:s,finisher(e){customElements.define(t,e)}}})(t,e),at=(t,e)=>"method"===e.kind&&e.descriptor&&!("value"in e.descriptor)?{...e,finisher(i){i.createProperty(e.key,t)}}:{kind:"field",key:Symbol(),placement:"own",descriptor:{},originalKey:e.key,initializer(){"function"==typeof e.initializer&&(this[e.key]=e.initializer.call(this))},finisher(i){i.createProperty(e.key,t)}};function lt(t){return(e,i)=>void 0!==i?((t,e,i)=>{e.constructor.createProperty(i,t)})(t,e,i):at(t,e)}function ct(t){return lt({...t,state:!0})}var dt;null===(dt=window.HTMLSlotElement)||void 0===dt||dt.prototype.assignedElements;var ht=function(t,e,i,s){var o,n=arguments.length,r=n<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,e,i,s);else for(var a=t.length-1;a>=0;a--)(o=t[a])&&(r=(n<3?o(r):n>3?o(e,i,r):o(e,i))||r);return n>3&&r&&Object.defineProperty(e,i,r),r};let ut=class extends ot{constructor(){super(...arguments),this.entities={days:{}}}static async getConfigElement(){return document.createElement("alarm-clock-card-editor")}static getStubConfig(){return{type:"custom:alarm-clock-card",device_id:"",name:"Alarm Clock",show_time_picker:!0,show_days:!0,show_scripts:!0,show_snooze_info:!0}}setConfig(t){if(!t.device_id)throw new Error("You need to define a device");this.config={show_time_picker:!0,show_days:!0,show_scripts:!0,show_snooze_info:!0,...t}}shouldUpdate(t){return!(!this.config||!t.has("config")&&(!t.has("hass")||(this._updateEntities(),0)))}async firstUpdated(){await this._updateEntities()}async _updateEntities(){if(this.hass&&this.config.device_id)try{console.log("🔍 ALARM CARD: Starting entity discovery for device:",this.config.device_id);const t=(await this.hass.callWS({type:"config/entity_registry/list"})).filter(t=>t.device_id===this.config.device_id).map(t=>t.entity_id);console.log("🔍 ALARM CARD: Found device entities:",t),this.entities={main:void 0,time:void 0,enabled:void 0,status:void 0,nextAlarm:void 0,timeUntil:void 0,snoozeButton:void 0,dismissButton:void 0,days:{}},t.forEach(t=>{const e=this.hass.states[t];e?(console.log(`🔍 ALARM CARD: Processing entity ${t} (state: ${e.state})`),t.startsWith("sensor.")&&(t.includes("alarm_clock")||"alarm_clock"===e.attributes.device_class)?(this.entities.main=e,console.log("✅ ALARM CARD: Found main sensor:",t,"state:",e.state)):t.startsWith("time.")?(this.entities.time=e,console.log("✅ ALARM CARD: Found time entity:",t,"state:",e.state)):t.startsWith("switch.")&&t.includes("alarm_enabled")?(this.entities.enabled=e,console.log("✅ ALARM CARD: Found enabled switch:",t,"state:",e.state)):t.startsWith("sensor.")&&t.includes("status")?(this.entities.status=e,console.log("✅ ALARM CARD: Found status sensor:",t,"state:",e.state)):t.startsWith("sensor.")&&t.includes("next_alarm")?(this.entities.nextAlarm=e,console.log("✅ ALARM CARD: Found next alarm sensor:",t,"state:",e.state)):t.startsWith("sensor.")&&t.includes("time_until")?(this.entities.timeUntil=e,console.log("✅ ALARM CARD: Found time until sensor:",t,"state:",e.state)):t.startsWith("button.")&&t.includes("snooze")?(this.entities.snoozeButton=e,console.log("✅ ALARM CARD: Found snooze button:",t)):t.startsWith("button.")&&t.includes("dismiss")?(this.entities.dismissButton=e,console.log("✅ ALARM CARD: Found dismiss button:",t)):t.startsWith("switch.")&&["monday","tuesday","wednesday","thursday","friday","saturday","sunday"].forEach(i=>{t.includes(i)&&(this.entities.days[i]=e,console.log(`✅ ALARM CARD: Found day switch for ${i}:`,t,"state:",e.state))})):console.warn("🔍 ALARM CARD: Entity not found in states:",t)}),console.log("🔍 ALARM CARD: Final entity mapping:",{main:this.entities.main?.entity_id,time:this.entities.time?.entity_id,enabled:this.entities.enabled?.entity_id,status:this.entities.status?.entity_id,nextAlarm:this.entities.nextAlarm?.entity_id,timeUntil:this.entities.timeUntil?.entity_id,snoozeButton:this.entities.snoozeButton?.entity_id,dismissButton:this.entities.dismissButton?.entity_id,days:Object.keys(this.entities.days).reduce((t,e)=>(t[e]=this.entities.days[e]?.entity_id,t),{})})}catch(t){console.error("❌ ALARM CARD: Error loading entity registry:",t)}}render(){if(!this.config||!this.entities.main)return H`
        <ha-card>
          <div class="warning">Device not available: ${this.config?.device_id}</div>
        </ha-card>
      `;const t=this.entities.main,e=this.entities.time,i=this.entities.enabled,s=this.entities.status,o=this.entities.nextAlarm,n=this.entities.timeUntil,r=e?.state||"07:00",a="on"===i?.state,l=s?.state||"off",c=o?.attributes?.next_alarm_time,d=o?.attributes?.next_alarm_day,h=n?.attributes?.human_readable,u=n?.attributes?.countdown_type;return console.log("🎯 ALARM CARD: Rendering with state:",{alarmTime:r,isEnabled:a,status:l,nextAlarm:c,nextAlarmDay:d,timeUntil:h,countdownType:u,mainState:t.state,mainAttributes:t.attributes,enabledState:i?.state,dayStates:Object.keys(this.entities.days).reduce((t,e)=>(t[e]=this.entities.days[e]?.state,t),{})}),H`
      <ha-card>
        <div class="card-content">
          <div class="header">
            <div class="title">${this.config.name||"Alarm Clock"}</div>
            <div class="status ${l}">${l}</div>
          </div>

          <div class="time-display">
            <div class="alarm-time">${r}</div>
            ${c?H`<div class="next-alarm">Next alarm: ${d} ${c}</div>`:H``}
            ${h?H`
                  <div class="countdown">
                    <span class="countdown-label">
                      ${"snooze"===u?"Snooze ends in:":"Alarm in:"}
                    </span>
                    <span class="countdown-time">${h}</span>
                  </div>
                `:H``}
          </div>

          ${this.config.show_time_picker?this._renderTimePicker(r):H``}
          ${this._renderControls(a,l)}
          ${this.config.show_days?this._renderDays():H``}
          ${this.config.show_scripts?this._renderScriptsInfo():H``}
          ${this.config.show_snooze_info&&"snoozed"===l?this._renderSnoozeInfo():H``}
        </div>
      </ha-card>
    `}_renderTimePicker(t){return H`
      <div class="time-picker">
        <input
          type="time"
          class="time-input"
          id="alarm-time-input"
          .value=${t}
          @change=${this._onTimeInputChange}
        />
        <mwc-button
          @click=${this._onSetTimeButtonClick}
          class="set-time-button"
        >
          Set Time
        </mwc-button>
      </div>
    `}_renderControls(t,e){return H`
      <div class="controls">
        <mwc-button
          raised
          class="control-button ${t?"danger":"primary"}"
          @click=${this._toggleAlarm}
        >
          ${t?"Disable":"Enable"} Alarm
        </mwc-button>
        ${"ringing"===e?H`
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
            `:H``}
      </div>
    `}_renderDays(){const t=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];return H`
      <div class="days-grid">
        ${["monday","tuesday","wednesday","thursday","friday","saturday","sunday"].map((e,i)=>{const s=this.entities.days[e];return H`
              <mwc-button
                class="day-button ${"on"===s?.state?"active":""}"
                @click=${()=>this._toggleDay(e)}
              >
                ${t[i]}
              </mwc-button>
            `})}
      </div>
    `}_renderScriptsInfo(){const t=this.entities.main;if(!t?.attributes)return H``;const e=[];return t.attributes.pre_alarm_enabled&&t.attributes.pre_alarm_script&&e.push({label:"Pre-alarm",value:`${t.attributes.pre_alarm_script} (${t.attributes.pre_alarm_minutes}m before)`}),t.attributes.alarm_script&&e.push({label:"Alarm",value:t.attributes.alarm_script}),t.attributes.post_alarm_enabled&&t.attributes.post_alarm_script&&e.push({label:"Post-alarm",value:`${t.attributes.post_alarm_script} (${t.attributes.post_alarm_minutes}m after)`}),0===e.length?H``:H`
      <div class="scripts-info">
        <div class="scripts-title">Configured Scripts</div>
        ${e.map(t=>H`
            <div class="script-item">
              <span class="script-label">${t.label}:</span>
              <span class="script-value">${t.value}</span>
            </div>
          `)}
      </div>
    `}_renderSnoozeInfo(){const t=this.entities.main;if(!t?.attributes)return H``;const e=t.attributes.snooze_count||0,i=t.attributes.max_snoozes||3,s=t.attributes.snooze_until;return H`
      <div class="snooze-info">
        <div>Snoozed (${e}/${i})</div>
        ${s?H`<div>Until: ${new Date(s).toLocaleTimeString()}</div>`:H``}
      </div>
    `}_onTimeInputChange(t){const e=t.target.value;this._setAlarmTime(e)}_onSetTimeButtonClick(t){const e=this.shadowRoot?.querySelector("#alarm-time-input");if(e){const t=e.value;this._setAlarmTime(t)}}_setAlarmTime(t){console.log("⏰ ALARM CARD: Setting alarm time to:",t),t&&this.entities.time?(console.log("⏰ ALARM CARD: Calling time.set_value service:",{entity_id:this.entities.time.entity_id,time:t}),this.hass.callService("time","set_value",{entity_id:this.entities.time.entity_id,time:t})):console.error("⏰ ALARM CARD: Cannot set time - missing time or time entity:",{time:t,timeEntity:this.entities.time?.entity_id})}_toggleAlarm(){if(console.log("🔘 ALARM CARD: Toggle alarm button clicked"),!this.entities.enabled)return void console.error("🔘 ALARM CARD: Cannot toggle alarm - no enabled entity found");const t=this.entities.enabled.state,e="on"===t?"turn_off":"turn_on";console.log("🔘 ALARM CARD: Toggling alarm:",{entityId:this.entities.enabled.entity_id,currentState:t,service:e}),this.hass.callService("switch",e,{entity_id:this.entities.enabled.entity_id})}_toggleDay(t){console.log("📅 ALARM CARD: Toggle day clicked:",t);const e=this.entities.days[t];if(!e)return void console.error("📅 ALARM CARD: Cannot toggle day - no entity found for:",t);const i=e.state,s="on"===i?"turn_off":"turn_on";console.log("📅 ALARM CARD: Toggling day:",{day:t,entityId:e.entity_id,currentState:i,service:s}),this.hass.callService("switch",s,{entity_id:e.entity_id})}_snoozeAlarm(){console.log("💤 ALARM CARD: Snooze button clicked"),this.entities.snoozeButton?(console.log("💤 ALARM CARD: Pressing snooze button:",this.entities.snoozeButton.entity_id),this.hass.callService("button","press",{entity_id:this.entities.snoozeButton.entity_id})):console.error("💤 ALARM CARD: Cannot snooze - no snooze button entity found")}_dismissAlarm(){console.log("🛑 ALARM CARD: Dismiss button clicked"),this.entities.dismissButton?(console.log("🛑 ALARM CARD: Pressing dismiss button:",this.entities.dismissButton.entity_id),this.hass.callService("button","press",{entity_id:this.entities.dismissButton.entity_id})):console.error("🛑 ALARM CARD: Cannot dismiss - no dismiss button entity found")}getCardSize(){return 6}static get styles(){return n`
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
    `}};var pt,mt,_t;ht([lt({attribute:!1})],ut.prototype,"hass",void 0),ht([ct()],ut.prototype,"config",void 0),ht([ct()],ut.prototype,"entities",void 0),ut=ht([rt("alarm-clock-card")],ut),window.customCards=window.customCards||[],window.customCards.push({type:"alarm-clock-card",name:"Alarm Clock Card",description:"A card for displaying and controlling alarm clock entities",preview:!0,documentationURL:"https://github.com/your-username/alarm-clock"}),console.info("%c  ALARM-CLOCK-CARD  %c  Version 1.0.0  ","color: orange; font-weight: bold; background: black","color: white; font-weight: bold; background: dimgray"),(_t=pt||(pt={})).language="language",_t.system="system",_t.comma_decimal="comma_decimal",_t.decimal_comma="decimal_comma",_t.space_comma="space_comma",_t.none="none",function(t){t.language="language",t.system="system",t.am_pm="12",t.twenty_four="24"}(mt||(mt={})),new Set(["fan","input_boolean","light","switch","group","automation"]);var vt=function(t,e,i,s){s=s||{},i=null==i?{}:i;var o=new Event(e,{bubbles:void 0===s.bubbles||s.bubbles,cancelable:Boolean(s.cancelable),composed:void 0===s.composed||s.composed});return o.detail=i,t.dispatchEvent(o),o};new Set(["call-service","divider","section","weblink","cast","select"]);var gt=function(t,e,i,s){var o,n=arguments.length,r=n<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,e,i,s);else for(var a=t.length-1;a>=0;a--)(o=t[a])&&(r=(n<3?o(r):n>3?o(e,i,r):o(e,i))||r);return n>3&&r&&Object.defineProperty(e,i,r),r};let ft=class extends ot{constructor(){super(...arguments),this._searchValue="",this._showDropdown=!1,this._filteredDevices=[],this._allDevices=[]}setConfig(t){this._config=t}get _device_id(){return this._config?.device_id||""}get _name(){return this._config?.name||""}get _show_time_picker(){return!1!==this._config?.show_time_picker}get _show_days(){return!1!==this._config?.show_days}get _show_scripts(){return!1!==this._config?.show_scripts}get _show_snooze_info(){return!1!==this._config?.show_snooze_info}render(){return this.hass&&this._config?H`
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
              ${this._filteredDevices.map(t=>H`
                <div class="result-item" @click=${()=>this._selectDevice(t)}>
                  <div class="device-name">${t.name}</div>
                  <div class="device-info">Device ID: ${t.id}</div>
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
    `:H``}_deviceChanged(t){if(!this._config||!this.hass)return;const e=t.detail.value;this._config={...this._config,device_id:e},vt(this,"config-changed",{config:this._config})}async _loadDevices(){if(this.hass)try{const t=await this.hass.callWS({type:"config/device_registry/list"});this._allDevices=t.filter(t=>"Alarm Clock Integration"===t.manufacturer||"Alarm Clock"===t.model||t.name&&t.name.toLowerCase().includes("alarm")).map(t=>({id:t.id,name:t.name_by_user||t.name||`Device ${t.id.substring(0,8)}`,manufacturer:t.manufacturer,model:t.model})),this._filteredDevices=this._allDevices}catch(t){console.error("Failed to load device registry:",t),this._allDevices=[],this._filteredDevices=[]}}_handleSearch(t){const e=t.target,i=e.value.toLowerCase();this._searchValue=e.value,0===i.length?this._filteredDevices=this._allDevices:this._filteredDevices=this._allDevices.filter(t=>t.name.toLowerCase().includes(i)||t.id.toLowerCase().includes(i)),this._showDropdown=!0}_showResults(){0===this._allDevices.length&&this._loadDevices(),this._showDropdown=!0}_hideResults(){setTimeout(()=>{this._showDropdown=!1},150)}_selectDevice(t){this._searchValue=t.name,this._showDropdown=!1,this._config={...this._config,device_id:t.id},vt(this,"config-changed",{config:this._config})}_nameChanged(t){if(!this._config||!this.hass)return;const e=t.target.value;this._config={...this._config,name:e},vt(this,"config-changed",{config:this._config})}_toggleChanged(t,e){if(!this._config||!this.hass)return;const i=e.target.checked;this._config={...this._config,[t]:i},vt(this,"config-changed",{config:this._config})}_valueChanged(t){if(!this._config||!this.hass)return;const e=t.target,i=e.configValue;if(this[`_${i}`]===e.value)return;let s;s="checkbox"===e.type?e.checked:e.value,i&&(this._config={...this._config,[i]:s}),vt(this,"config-changed",{config:this._config})}static get styles(){return n`
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
    `}};gt([lt({attribute:!1})],ft.prototype,"hass",void 0),gt([ct()],ft.prototype,"_config",void 0),gt([ct()],ft.prototype,"_helpers",void 0),gt([ct()],ft.prototype,"_searchValue",void 0),gt([ct()],ft.prototype,"_showDropdown",void 0),gt([ct()],ft.prototype,"_filteredDevices",void 0),gt([ct()],ft.prototype,"_allDevices",void 0),ft=gt([rt("alarm-clock-card-editor")],ft),console.info("%c  ALARM-CLOCK-CARD  %c  Version 1.0.0  ","color: orange; font-weight: bold; background: black","color: white; font-weight: bold; background: dimgray")})();