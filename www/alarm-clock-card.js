/*! For license information please see alarm-clock-card.js.LICENSE.txt */
(()=>{"use strict";const t=window,e=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,i=Symbol(),s=new WeakMap;class o{constructor(t,e,s){if(this._$cssResult$=!0,s!==i)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const i=this.t;if(e&&void 0===t){const e=void 0!==i&&1===i.length;e&&(t=s.get(i)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&s.set(i,t))}return t}toString(){return this.cssText}}const n=(t,...e)=>{const s=1===t.length?t[0]:e.reduce((e,i,s)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[s+1],t[0]);return new o(s,t,i)},r=e?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new o("string"==typeof t?t:t+"",void 0,i))(e)})(t):t;var a;const l=window,c=l.trustedTypes,d=c?c.emptyScript:"",h=l.reactiveElementPolyfillSupport,u={toAttribute(t,e){switch(e){case Boolean:t=t?d:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},p=(t,e)=>e!==t&&(e==e||t==t),_={attribute:!0,type:String,converter:u,reflect:!1,hasChanged:p},m="finalized";class g extends HTMLElement{constructor(){super(),this._$Ei=new Map,this.isUpdatePending=!1,this.hasUpdated=!1,this._$El=null,this._$Eu()}static addInitializer(t){var e;this.finalize(),(null!==(e=this.h)&&void 0!==e?e:this.h=[]).push(t)}static get observedAttributes(){this.finalize();const t=[];return this.elementProperties.forEach((e,i)=>{const s=this._$Ep(i,e);void 0!==s&&(this._$Ev.set(s,i),t.push(s))}),t}static createProperty(t,e=_){if(e.state&&(e.attribute=!1),this.finalize(),this.elementProperties.set(t,e),!e.noAccessor&&!this.prototype.hasOwnProperty(t)){const i="symbol"==typeof t?Symbol():"__"+t,s=this.getPropertyDescriptor(t,i,e);void 0!==s&&Object.defineProperty(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){return{get(){return this[e]},set(s){const o=this[t];this[e]=s,this.requestUpdate(t,o,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)||_}static finalize(){if(this.hasOwnProperty(m))return!1;this[m]=!0;const t=Object.getPrototypeOf(this);if(t.finalize(),void 0!==t.h&&(this.h=[...t.h]),this.elementProperties=new Map(t.elementProperties),this._$Ev=new Map,this.hasOwnProperty("properties")){const t=this.properties,e=[...Object.getOwnPropertyNames(t),...Object.getOwnPropertySymbols(t)];for(const i of e)this.createProperty(i,t[i])}return this.elementStyles=this.finalizeStyles(this.styles),!0}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(r(t))}else void 0!==t&&e.push(r(t));return e}static _$Ep(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}_$Eu(){var t;this._$E_=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$Eg(),this.requestUpdate(),null===(t=this.constructor.h)||void 0===t||t.forEach(t=>t(this))}addController(t){var e,i;(null!==(e=this._$ES)&&void 0!==e?e:this._$ES=[]).push(t),void 0!==this.renderRoot&&this.isConnected&&(null===(i=t.hostConnected)||void 0===i||i.call(t))}removeController(t){var e;null===(e=this._$ES)||void 0===e||e.splice(this._$ES.indexOf(t)>>>0,1)}_$Eg(){this.constructor.elementProperties.forEach((t,e)=>{this.hasOwnProperty(e)&&(this._$Ei.set(e,this[e]),delete this[e])})}createRenderRoot(){var i;const s=null!==(i=this.shadowRoot)&&void 0!==i?i:this.attachShadow(this.constructor.shadowRootOptions);return((i,s)=>{e?i.adoptedStyleSheets=s.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet):s.forEach(e=>{const s=document.createElement("style"),o=t.litNonce;void 0!==o&&s.setAttribute("nonce",o),s.textContent=e.cssText,i.appendChild(s)})})(s,this.constructor.elementStyles),s}connectedCallback(){var t;void 0===this.renderRoot&&(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),null===(t=this._$ES)||void 0===t||t.forEach(t=>{var e;return null===(e=t.hostConnected)||void 0===e?void 0:e.call(t)})}enableUpdating(t){}disconnectedCallback(){var t;null===(t=this._$ES)||void 0===t||t.forEach(t=>{var e;return null===(e=t.hostDisconnected)||void 0===e?void 0:e.call(t)})}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$EO(t,e,i=_){var s;const o=this.constructor._$Ep(t,i);if(void 0!==o&&!0===i.reflect){const n=(void 0!==(null===(s=i.converter)||void 0===s?void 0:s.toAttribute)?i.converter:u).toAttribute(e,i.type);this._$El=t,null==n?this.removeAttribute(o):this.setAttribute(o,n),this._$El=null}}_$AK(t,e){var i;const s=this.constructor,o=s._$Ev.get(t);if(void 0!==o&&this._$El!==o){const t=s.getPropertyOptions(o),n="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==(null===(i=t.converter)||void 0===i?void 0:i.fromAttribute)?t.converter:u;this._$El=o,this[o]=n.fromAttribute(e,t.type),this._$El=null}}requestUpdate(t,e,i){let s=!0;void 0!==t&&(((i=i||this.constructor.getPropertyOptions(t)).hasChanged||p)(this[t],e)?(this._$AL.has(t)||this._$AL.set(t,e),!0===i.reflect&&this._$El!==t&&(void 0===this._$EC&&(this._$EC=new Map),this._$EC.set(t,i))):s=!1),!this.isUpdatePending&&s&&(this._$E_=this._$Ej())}async _$Ej(){this.isUpdatePending=!0;try{await this._$E_}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;this.hasUpdated,this._$Ei&&(this._$Ei.forEach((t,e)=>this[e]=t),this._$Ei=void 0);let e=!1;const i=this._$AL;try{e=this.shouldUpdate(i),e?(this.willUpdate(i),null===(t=this._$ES)||void 0===t||t.forEach(t=>{var e;return null===(e=t.hostUpdate)||void 0===e?void 0:e.call(t)}),this.update(i)):this._$Ek()}catch(t){throw e=!1,this._$Ek(),t}e&&this._$AE(i)}willUpdate(t){}_$AE(t){var e;null===(e=this._$ES)||void 0===e||e.forEach(t=>{var e;return null===(e=t.hostUpdated)||void 0===e?void 0:e.call(t)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$Ek(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$E_}shouldUpdate(t){return!0}update(t){void 0!==this._$EC&&(this._$EC.forEach((t,e)=>this._$EO(e,this[e],t)),this._$EC=void 0),this._$Ek()}updated(t){}firstUpdated(t){}}var v;g[m]=!0,g.elementProperties=new Map,g.elementStyles=[],g.shadowRootOptions={mode:"open"},null==h||h({ReactiveElement:g}),(null!==(a=l.reactiveElementVersions)&&void 0!==a?a:l.reactiveElementVersions=[]).push("1.6.3");const f=window,y=f.trustedTypes,A=y?y.createPolicy("lit-html",{createHTML:t=>t}):void 0,$="$lit$",b=`lit$${(Math.random()+"").slice(9)}$`,w="?"+b,x=`<${w}>`,C=document,R=()=>C.createComment(""),S=t=>null===t||"object"!=typeof t&&"function"!=typeof t,E=Array.isArray,k="[ \t\n\f\r]",D=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,M=/-->/g,L=/>/g,T=RegExp(`>|${k}(?:([^\\s"'>=/]+)(${k}*=${k}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),z=/'/g,P=/"/g,U=/^(?:script|style|textarea|title)$/i,O=t=>(e,...i)=>({_$litType$:t,strings:e,values:i}),N=O(1),H=(O(2),Symbol.for("lit-noChange")),j=Symbol.for("lit-nothing"),I=new WeakMap,q=C.createTreeWalker(C,129,null,!1);function B(t,e){if(!Array.isArray(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==A?A.createHTML(e):e}const V=(t,e)=>{const i=t.length-1,s=[];let o,n=2===e?"<svg>":"",r=D;for(let e=0;e<i;e++){const i=t[e];let a,l,c=-1,d=0;for(;d<i.length&&(r.lastIndex=d,l=r.exec(i),null!==l);)d=r.lastIndex,r===D?"!--"===l[1]?r=M:void 0!==l[1]?r=L:void 0!==l[2]?(U.test(l[2])&&(o=RegExp("</"+l[2],"g")),r=T):void 0!==l[3]&&(r=T):r===T?">"===l[0]?(r=null!=o?o:D,c=-1):void 0===l[1]?c=-2:(c=r.lastIndex-l[2].length,a=l[1],r=void 0===l[3]?T:'"'===l[3]?P:z):r===P||r===z?r=T:r===M||r===L?r=D:(r=T,o=void 0);const h=r===T&&t[e+1].startsWith("/>")?" ":"";n+=r===D?i+x:c>=0?(s.push(a),i.slice(0,c)+$+i.slice(c)+b+h):i+b+(-2===c?(s.push(void 0),e):h)}return[B(t,n+(t[i]||"<?>")+(2===e?"</svg>":"")),s]};class F{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let o=0,n=0;const r=t.length-1,a=this.parts,[l,c]=V(t,e);if(this.el=F.createElement(l,i),q.currentNode=this.el.content,2===e){const t=this.el.content,e=t.firstChild;e.remove(),t.append(...e.childNodes)}for(;null!==(s=q.nextNode())&&a.length<r;){if(1===s.nodeType){if(s.hasAttributes()){const t=[];for(const e of s.getAttributeNames())if(e.endsWith($)||e.startsWith(b)){const i=c[n++];if(t.push(e),void 0!==i){const t=s.getAttribute(i.toLowerCase()+$).split(b),e=/([.?@])?(.*)/.exec(i);a.push({type:1,index:o,name:e[2],strings:t,ctor:"."===e[1]?Z:"?"===e[1]?G:"@"===e[1]?Q:Y})}else a.push({type:6,index:o})}for(const e of t)s.removeAttribute(e)}if(U.test(s.tagName)){const t=s.textContent.split(b),e=t.length-1;if(e>0){s.textContent=y?y.emptyScript:"";for(let i=0;i<e;i++)s.append(t[i],R()),q.nextNode(),a.push({type:2,index:++o});s.append(t[e],R())}}}else if(8===s.nodeType)if(s.data===w)a.push({type:2,index:o});else{let t=-1;for(;-1!==(t=s.data.indexOf(b,t+1));)a.push({type:7,index:o}),t+=b.length-1}o++}}static createElement(t,e){const i=C.createElement("template");return i.innerHTML=t,i}}function W(t,e,i=t,s){var o,n,r,a;if(e===H)return e;let l=void 0!==s?null===(o=i._$Co)||void 0===o?void 0:o[s]:i._$Cl;const c=S(e)?void 0:e._$litDirective$;return(null==l?void 0:l.constructor)!==c&&(null===(n=null==l?void 0:l._$AO)||void 0===n||n.call(l,!1),void 0===c?l=void 0:(l=new c(t),l._$AT(t,i,s)),void 0!==s?(null!==(r=(a=i)._$Co)&&void 0!==r?r:a._$Co=[])[s]=l:i._$Cl=l),void 0!==l&&(e=W(t,l._$AS(t,e.values),l,s)),e}class K{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){var e;const{el:{content:i},parts:s}=this._$AD,o=(null!==(e=null==t?void 0:t.creationScope)&&void 0!==e?e:C).importNode(i,!0);q.currentNode=o;let n=q.nextNode(),r=0,a=0,l=s[0];for(;void 0!==l;){if(r===l.index){let e;2===l.type?e=new J(n,n.nextSibling,this,t):1===l.type?e=new l.ctor(n,l.name,l.strings,this,t):6===l.type&&(e=new tt(n,this,t)),this._$AV.push(e),l=s[++a]}r!==(null==l?void 0:l.index)&&(n=q.nextNode(),r++)}return q.currentNode=C,o}v(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class J{constructor(t,e,i,s){var o;this.type=2,this._$AH=j,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cp=null===(o=null==s?void 0:s.isConnected)||void 0===o||o}get _$AU(){var t,e;return null!==(e=null===(t=this._$AM)||void 0===t?void 0:t._$AU)&&void 0!==e?e:this._$Cp}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===(null==t?void 0:t.nodeType)&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=W(this,t,e),S(t)?t===j||null==t||""===t?(this._$AH!==j&&this._$AR(),this._$AH=j):t!==this._$AH&&t!==H&&this._(t):void 0!==t._$litType$?this.g(t):void 0!==t.nodeType?this.$(t):(t=>E(t)||"function"==typeof(null==t?void 0:t[Symbol.iterator]))(t)?this.T(t):this._(t)}k(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}$(t){this._$AH!==t&&(this._$AR(),this._$AH=this.k(t))}_(t){this._$AH!==j&&S(this._$AH)?this._$AA.nextSibling.data=t:this.$(C.createTextNode(t)),this._$AH=t}g(t){var e;const{values:i,_$litType$:s}=t,o="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=F.createElement(B(s.h,s.h[0]),this.options)),s);if((null===(e=this._$AH)||void 0===e?void 0:e._$AD)===o)this._$AH.v(i);else{const t=new K(o,this),e=t.u(this.options);t.v(i),this.$(e),this._$AH=t}}_$AC(t){let e=I.get(t.strings);return void 0===e&&I.set(t.strings,e=new F(t)),e}T(t){E(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,s=0;for(const o of t)s===e.length?e.push(i=new J(this.k(R()),this.k(R()),this,this.options)):i=e[s],i._$AI(o),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){var i;for(null===(i=this._$AP)||void 0===i||i.call(this,!1,!0,e);t&&t!==this._$AB;){const e=t.nextSibling;t.remove(),t=e}}setConnected(t){var e;void 0===this._$AM&&(this._$Cp=t,null===(e=this._$AP)||void 0===e||e.call(this,t))}}class Y{constructor(t,e,i,s,o){this.type=1,this._$AH=j,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=o,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=j}get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}_$AI(t,e=this,i,s){const o=this.strings;let n=!1;if(void 0===o)t=W(this,t,e,0),n=!S(t)||t!==this._$AH&&t!==H,n&&(this._$AH=t);else{const s=t;let r,a;for(t=o[0],r=0;r<o.length-1;r++)a=W(this,s[i+r],e,r),a===H&&(a=this._$AH[r]),n||(n=!S(a)||a!==this._$AH[r]),a===j?t=j:t!==j&&(t+=(null!=a?a:"")+o[r+1]),this._$AH[r]=a}n&&!s&&this.j(t)}j(t){t===j?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,null!=t?t:"")}}class Z extends Y{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===j?void 0:t}}const X=y?y.emptyScript:"";class G extends Y{constructor(){super(...arguments),this.type=4}j(t){t&&t!==j?this.element.setAttribute(this.name,X):this.element.removeAttribute(this.name)}}class Q extends Y{constructor(t,e,i,s,o){super(t,e,i,s,o),this.type=5}_$AI(t,e=this){var i;if((t=null!==(i=W(this,t,e,0))&&void 0!==i?i:j)===H)return;const s=this._$AH,o=t===j&&s!==j||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,n=t!==j&&(s===j||o);o&&this.element.removeEventListener(this.name,this,s),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e,i;"function"==typeof this._$AH?this._$AH.call(null!==(i=null===(e=this.options)||void 0===e?void 0:e.host)&&void 0!==i?i:this.element,t):this._$AH.handleEvent(t)}}class tt{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){W(this,t)}}const et=f.litHtmlPolyfillSupport;var it,st;null==et||et(F,J),(null!==(v=f.litHtmlVersions)&&void 0!==v?v:f.litHtmlVersions=[]).push("2.8.0");class ot extends g{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var t,e;const i=super.createRenderRoot();return null!==(t=(e=this.renderOptions).renderBefore)&&void 0!==t||(e.renderBefore=i.firstChild),i}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{var s,o;const n=null!==(s=null==i?void 0:i.renderBefore)&&void 0!==s?s:e;let r=n._$litPart$;if(void 0===r){const t=null!==(o=null==i?void 0:i.renderBefore)&&void 0!==o?o:null;n._$litPart$=r=new J(e.insertBefore(R(),t),t,void 0,null!=i?i:{})}return r._$AI(t),r})(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),null===(t=this._$Do)||void 0===t||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),null===(t=this._$Do)||void 0===t||t.setConnected(!1)}render(){return H}}ot.finalized=!0,ot._$litElement$=!0,null===(it=globalThis.litElementHydrateSupport)||void 0===it||it.call(globalThis,{LitElement:ot});const nt=globalThis.litElementPolyfillSupport;null==nt||nt({LitElement:ot}),(null!==(st=globalThis.litElementVersions)&&void 0!==st?st:globalThis.litElementVersions=[]).push("3.3.3");const rt=t=>e=>"function"==typeof e?((t,e)=>(customElements.define(t,e),e))(t,e):((t,e)=>{const{kind:i,elements:s}=e;return{kind:i,elements:s,finisher(e){customElements.define(t,e)}}})(t,e),at=(t,e)=>"method"===e.kind&&e.descriptor&&!("value"in e.descriptor)?{...e,finisher(i){i.createProperty(e.key,t)}}:{kind:"field",key:Symbol(),placement:"own",descriptor:{},originalKey:e.key,initializer(){"function"==typeof e.initializer&&(this[e.key]=e.initializer.call(this))},finisher(i){i.createProperty(e.key,t)}};function lt(t){return(e,i)=>void 0!==i?((t,e,i)=>{e.constructor.createProperty(i,t)})(t,e,i):at(t,e)}function ct(t){return lt({...t,state:!0})}var dt;null===(dt=window.HTMLSlotElement)||void 0===dt||dt.prototype.assignedElements;var ht=function(t,e,i,s){var o,n=arguments.length,r=n<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,e,i,s);else for(var a=t.length-1;a>=0;a--)(o=t[a])&&(r=(n<3?o(r):n>3?o(e,i,r):o(e,i))||r);return n>3&&r&&Object.defineProperty(e,i,r),r};let ut=class extends ot{constructor(){super(...arguments),this.entities={}}static async getConfigElement(){return document.createElement("alarm-clock-card-editor")}static getStubConfig(){return{type:"custom:alarm-clock-card",device_id:"",name:"Alarm Clock",show_time_picker:!0,show_days:!0,show_scripts:!0,show_snooze_info:!0}}setConfig(t){if(!t.device_id)throw new Error("You need to define a device_id");this.config={show_time_picker:!0,show_days:!0,show_scripts:!0,show_snooze_info:!0,...t}}shouldUpdate(t){return console.log("🔍 ALARM CARD: shouldUpdate called",{hasConfig:!!this.config,hasHass:!!this.hass,hasEntities:Object.keys(this.entities).length>0,changedProps:Array.from(t.keys())}),this.config?(t.has("hass")&&this.hass&&this.config&&(0===Object.keys(this.entities).length?(console.log("🔍 ALARM CARD: No entities yet, calling _updateEntities"),this._updateEntities()):(console.log("🔍 ALARM CARD: Refreshing entity states"),this._refreshEntityStates())),t.has("config")||t.has("hass")||t.has("entities")):(console.log("🔍 ALARM CARD: No config, returning false"),!1)}_refreshEntityStates(){let t=!1;const e={...this.entities,days:{...this.entities.days}};for(const[i,s]of Object.entries(this.entities))if("days"!==i&&s&&s.entity_id){const o=this.hass.states[s.entity_id];!o||o.state===s.state&&o.last_updated===s.last_updated||(console.log(`🔍 ALARM CARD: ${i} entity changed:`,s.state,"→",o.state),e[i]=o,t=!0)}if(this.entities.days)for(const[i,s]of Object.entries(this.entities.days))if(s&&s.entity_id){const o=this.hass.states[s.entity_id];!o||o.state===s.state&&o.last_updated===s.last_updated||(console.log(`🔍 ALARM CARD: Day ${i} entity changed:`,s.state,"→",o.state),e.days[i]=o,t=!0)}t&&(console.log("🔍 ALARM CARD: Changes detected, updating entities object"),this.entities=e)}async _updateEntities(){if(this.hass&&this.config.device_id){console.log("🔍 ALARM CARD: Looking for entities for device:",this.config.device_id);try{const t=await this.hass.callWS({type:"config/entity_registry/list"});console.log("🔍 ALARM CARD: Entity registry loaded, total entities:",t.length);const e=t.filter(t=>t.device_id===this.config.device_id);console.log("🔍 ALARM CARD: Found device entities:",e.length,e);let i=null;for(const t of e)if(t.unique_id&&t.entity_id.startsWith("sensor.")&&t.unique_id&&!t.unique_id.includes("_")){i=t.unique_id,console.log("🔍 ALARM CARD: Found coordinator unique_id:",i);break}if(!i)return console.error("🔍 ALARM CARD: Could not find coordinator unique_id"),void(this.entities={});const s={days:{}};console.log("🔍 ALARM CARD: Processing device entities using unique_id patterns:");for(const t of e){if(console.log("🔍 ALARM CARD: Checking entity:",t.entity_id,"unique_id:",t.unique_id),!t.unique_id){console.log("🔍 ALARM CARD: No unique_id found for:",t.entity_id);continue}const e=this.hass.states[t.entity_id],o=t.unique_id;if(o===i)console.log("🔍 ALARM CARD: Found MAIN entity:",t.entity_id),s.main=e||{entity_id:t.entity_id,state:"unknown"};else if(o===`${i}_alarm_time`)console.log("🔍 ALARM CARD: Found TIME entity:",t.entity_id),s.time=e||{entity_id:t.entity_id,state:"07:00"};else if(o===`${i}_alarm_enabled`)console.log("🔍 ALARM CARD: Found MAIN ENABLED entity:",t.entity_id),s.enabled=e||{entity_id:t.entity_id,state:"off"};else if(o===`${i}_alarm_status`)console.log("🔍 ALARM CARD: Found STATUS entity:",t.entity_id),s.status=e||{entity_id:t.entity_id,state:"off"};else if(o===`${i}_next_alarm`)console.log("🔍 ALARM CARD: Found NEXT_ALARM entity:",t.entity_id),s.nextAlarm=e||{entity_id:t.entity_id,state:null};else if(o===`${i}_time_until_alarm`)console.log("🔍 ALARM CARD: Found TIME_UNTIL entity:",t.entity_id),s.timeUntil=e||{entity_id:t.entity_id,state:null};else if(o.startsWith(`${i}_`)&&o!==`${i}_alarm_enabled`){const i=o.match(/_(\w+)$/);if(i&&"enabled"!==i[1]){const o=i[1];["monday","tuesday","wednesday","thursday","friday","saturday","sunday"].includes(o)&&(console.log("🔍 ALARM CARD: Found DAY entity:",t.entity_id,o),s.days[o]=e||{entity_id:t.entity_id,state:"off"})}}else console.log("🔍 ALARM CARD: Unmatched entity:",t.entity_id,o)}console.log("🔍 ALARM CARD: Final mapped entities:",s),console.log("🔍 ALARM CARD: Entity count - main:",!!s.main,"time:",!!s.time,"enabled:",!!s.enabled,"days:",Object.keys(s.days||{}).length),this.entities=s}catch(t){console.error("🔍 ALARM CARD: Error loading entity registry:",t),this.entities={}}}else console.error("🔍 ALARM CARD: Missing hass or device_id:",{hass:!!this.hass,device_id:this.config.device_id})}render(){if(!this.config||0===Object.keys(this.entities).length)return N`
        <ha-card>
          <div class="warning">
            ${this.config?`Device not available: ${this.config.device_id}`:"No configuration"}
          </div>
        </ha-card>
      `;const t=this.entities.time?.entity_id?this.hass.states[this.entities.time.entity_id]:null,e=this.entities.enabled?.entity_id?this.hass.states[this.entities.enabled.entity_id]:null,i=this.entities.main?.entity_id?this.hass.states[this.entities.main.entity_id]:null,s=t?.state||"07:00",o=this._formatTime12Hour(s),n="on"===e?.state,r=i?.state||"off";console.log("🔍 ALARM CARD: Status logic debug (FRESH DATA):",{timeEntityId:this.entities.time?.entity_id,enabledEntityId:this.entities.enabled?.entity_id,mainEntityId:this.entities.main?.entity_id,enabledEntityFreshState:e?.state,mainEntityFreshState:i?.state,isEnabled:n,finalStatus:r});const a=this.entities.nextAlarm?.attributes||{},l=this.entities.timeUntil?.attributes||{},c=this.entities.nextAlarm?.state,d=a.next_alarm_day,h=l.human_readable,u=l.countdown_type,p=Object.keys(this.entities.days||{}).filter(t=>"on"===this.entities.days[t]?.state);return console.log("🎯 ALARM CARD: Rendering with entity states:",{alarmTime:o,isEnabled:n,status:r,nextAlarm:c,nextAlarmDay:d,timeUntil:h,countdownType:u,enabledDays:p,entities:this.entities}),N`
      <ha-card>
        <div class="card-content">
          <div class="header">
            <div class="title">${this.config.name||"Alarm Clock"}</div>
            <div class="status ${r}">${r}</div>
          </div>

          <div class="time-display">
            <div class="alarm-time">${o}</div>
            ${c&&d?N`<div class="next-alarm">Next alarm: ${d} at ${new Date(c).toLocaleTimeString()}</div>`:N``}
            ${h?N`
                  <div class="countdown">
                    <span class="countdown-label">
                      ${"snooze"===u?"Snooze ends in:":"Alarm in:"}
                    </span>
                    <span class="countdown-time">${h}</span>
                  </div>
                `:N``}
          </div>

          ${this.config.show_time_picker?this._renderTimePicker(o):N``}
          ${this._renderControls(n,r)}
          ${this.config.show_days?this._renderDays(p):N``}
          ${this.config.show_snooze_info&&"snoozed"===r?this._renderSnoozeInfo():N``}
        </div>
      </ha-card>
    `}_renderTimePicker(t){const e=this.entities.time?.state||"07:00";return N`
      <div class="time-picker">
        <input
          type="time"
          class="time-input"
          id="alarm-time-input"
          .value=${e}
          value=${e}
          @change=${this._onTimeInputChange}
        />
        <mwc-button
          @click=${this._onSetTimeButtonClick}
          class="set-time-button"
        >
          Set Time
        </mwc-button>
      </div>
    `}_renderControls(t,e){return N`
      <div class="controls">
        <mwc-button
          raised
          class="control-button ${t?"danger":"primary"}"
          @click=${this._toggleAlarm}
        >
          ${t?"Disable":"Enable"} Alarm
        </mwc-button>
        ${"ringing"===e?N`
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
            `:N``}
      </div>
    `}_renderDays(t){const e=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];return N`
      <div class="days-grid">
        ${["monday","tuesday","wednesday","thursday","friday","saturday","sunday"].map((i,s)=>{const o=t.includes(i);return N`
              <mwc-button
                class="day-button ${o?"active":""}"
                @click=${()=>this._toggleDay(i)}
              >
                ${e[s]}
              </mwc-button>
            `})}
      </div>
    `}_renderScriptsInfo(t){const e=[];return t.pre_alarm_enabled&&t.pre_alarm_script&&e.push({label:"Pre-alarm",value:`${t.pre_alarm_script} (${t.pre_alarm_minutes}m before)`}),t.alarm_script&&e.push({label:"Alarm",value:t.alarm_script}),t.post_alarm_enabled&&t.post_alarm_script&&e.push({label:"Post-alarm",value:`${t.post_alarm_script} (${t.post_alarm_minutes}m after)`}),0===e.length?N``:N`
      <div class="scripts-info">
        <div class="scripts-title">Configured Scripts</div>
        ${e.map(t=>N`
            <div class="script-item">
              <span class="script-label">${t.label}:</span>
              <span class="script-value">${t.value}</span>
            </div>
          `)}
      </div>
    `}_renderSnoozeInfo(){const t=this.entities.timeUntil?.attributes||{},e=t.snooze_count||0,i=this.entities.main?.attributes?.max_snoozes||3,s=t.snooze_until;return N`
      <div class="snooze-info">
        <div>Snoozed (${e}/${i})</div>
        ${s?N`<div>Until: ${new Date(s).toLocaleTimeString()}</div>`:N``}
      </div>
    `}_onTimeInputChange(t){}_onSetTimeButtonClick(t){const e=this.shadowRoot?.querySelector("#alarm-time-input");if(e){const t=e.value;this._setAlarmTime(t)}}_setAlarmTime(t){console.log("⏰ ALARM CARD: Setting alarm time to:",t),t&&this.config.device_id?(console.log("⏰ ALARM CARD: Calling alarm_clock.set_alarm service:",{device_id:this.config.device_id,time:t}),this.hass.callService("alarm_clock","set_alarm",{device_id:this.config.device_id,time:t}),setTimeout(()=>this._refreshEntityStates(),100)):console.error("⏰ ALARM CARD: Cannot set time - missing time or device_id:",{time:t,device_id:this.config.device_id})}_toggleAlarm(){if(console.log("🔘 ALARM CARD: Toggle alarm button clicked"),!this.config.device_id||!this.hass)return void console.error("🔘 ALARM CARD: Cannot toggle alarm - no device_id found");const t="on"===this.entities.enabled?.state,e=t?"turn_off":"turn_on";console.log("🔘 ALARM CARD: Toggling alarm via switch:",{device_id:this.config.device_id,currentEnabled:t,service:e}),this.hass.callService("switch",e,{entity_id:this.entities.enabled?.entity_id}),setTimeout(()=>this._refreshEntityStates(),100)}async _toggleDay(t){if(console.log("📅 ALARM CARD: Toggle day clicked:",t),!this.config.device_id)return void console.error("📅 ALARM CARD: Cannot toggle day - no device_id found:",t);const e=this.entities.days?.[t];if(!e)return void console.error("📅 ALARM CARD: Cannot toggle day - no day entity found:",t);const i="on"===e.state,s=i?"turn_off":"turn_on";console.log("📅 ALARM CARD: Toggling day switch:",{day:t,device_id:this.config.device_id,currentEnabled:i,service:s}),await this.hass.callService("switch",s,{entity_id:e.entity_id}),console.log("📅 ALARM CARD: Service call completed, forcing refresh"),setTimeout(()=>this._refreshEntityStates(),100)}_snoozeAlarm(){console.log("💤 ALARM CARD: Snooze button clicked"),this.config.device_id?(console.log("💤 ALARM CARD: Calling snooze service:",this.config.device_id),this.hass.callService("alarm_clock","snooze",{device_id:this.config.device_id}),setTimeout(()=>this._refreshEntityStates(),100)):console.error("💤 ALARM CARD: Cannot snooze - no device_id found")}_dismissAlarm(){console.log("🛑 ALARM CARD: Dismiss button clicked"),this.config.device_id?(console.log("🛑 ALARM CARD: Calling dismiss service:",this.config.device_id),this.hass.callService("alarm_clock","dismiss",{device_id:this.config.device_id}),setTimeout(()=>this._refreshEntityStates(),100)):console.error("🛑 ALARM CARD: Cannot dismiss - no device_id found")}_formatTime12Hour(t){if(!t||"off"===t)return t;try{const[e,i]=t.split(":"),s=parseInt(e,10),o=parseInt(i,10),n=s>=12?"PM":"AM";return`${0===s?12:s>12?s-12:s}:${o.toString().padStart(2,"0")} ${n}`}catch(e){return t}}getCardSize(){return 6}static get styles(){return n`
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
        display: flex;
        justify-content: space-between;
        gap: 2px;
        margin: 20px 0;
        overflow: hidden;
      }

      .day-button {
        --mdc-theme-primary: var(--secondary-background-color);
        --mdc-theme-on-primary: var(--secondary-text-color);
        min-width: unset;
        flex: 1;
        max-width: calc((100% - 12px) / 7);
        height: 32px;
        font-size: 10px;
        padding: 0 2px;
        box-sizing: border-box;
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
    `}};var pt,_t,mt;ht([lt({attribute:!1})],ut.prototype,"hass",void 0),ht([ct()],ut.prototype,"config",void 0),ht([ct()],ut.prototype,"entities",void 0),ut=ht([rt("alarm-clock-card")],ut),window.customCards=window.customCards||[],window.customCards.push({type:"alarm-clock-card",name:"Alarm Clock Card",description:"A card for displaying and controlling alarm clock entities",preview:!0,documentationURL:"https://github.com/siegeld/alarm-clock"}),console.info("%c  ALARM-CLOCK-CARD  %c  Version 1.3.7  ","color: orange; font-weight: bold; background: black","color: white; font-weight: bold; background: dimgray"),(mt=pt||(pt={})).language="language",mt.system="system",mt.comma_decimal="comma_decimal",mt.decimal_comma="decimal_comma",mt.space_comma="space_comma",mt.none="none",function(t){t.language="language",t.system="system",t.am_pm="12",t.twenty_four="24"}(_t||(_t={})),new Set(["fan","input_boolean","light","switch","group","automation"]);var gt=function(t,e,i,s){s=s||{},i=null==i?{}:i;var o=new Event(e,{bubbles:void 0===s.bubbles||s.bubbles,cancelable:Boolean(s.cancelable),composed:void 0===s.composed||s.composed});return o.detail=i,t.dispatchEvent(o),o};new Set(["call-service","divider","section","weblink","cast","select"]);var vt=function(t,e,i,s){var o,n=arguments.length,r=n<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,e,i,s);else for(var a=t.length-1;a>=0;a--)(o=t[a])&&(r=(n<3?o(r):n>3?o(e,i,r):o(e,i))||r);return n>3&&r&&Object.defineProperty(e,i,r),r};let ft=class extends ot{constructor(){super(...arguments),this._searchValue="",this._showDropdown=!1,this._filteredDevices=[],this._allDevices=[]}setConfig(t){this._config=t}get _device_id(){return this._config?.device_id||""}get _name(){return this._config?.name||""}get _show_time_picker(){return!1!==this._config?.show_time_picker}get _show_days(){return!1!==this._config?.show_days}get _show_scripts(){return!1!==this._config?.show_scripts}get _show_snooze_info(){return!1!==this._config?.show_snooze_info}render(){return this.hass&&this._config?N`
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
              ${this._filteredDevices.map(t=>N`
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
    `:N``}async _loadDevices(){if(this.hass)try{const t=await this.hass.callWS({type:"config/device_registry/list"});this._allDevices=t.filter(t=>"Alarm Clock Integration"===t.manufacturer||"Alarm Clock"===t.model||t.name&&t.name.toLowerCase().includes("alarm")).map(t=>({id:t.id,name:t.name_by_user||t.name||`Device ${t.id.substring(0,8)}`,manufacturer:t.manufacturer,model:t.model})),this._filteredDevices=this._allDevices}catch(t){console.error("Failed to load device registry:",t),this._allDevices=[],this._filteredDevices=[]}}_handleSearch(t){const e=t.target,i=e.value.toLowerCase();this._searchValue=e.value,0===i.length?this._filteredDevices=this._allDevices:this._filteredDevices=this._allDevices.filter(t=>t.name.toLowerCase().includes(i)||t.id.toLowerCase().includes(i)),this._showDropdown=!0}_showResults(){0===this._allDevices.length&&this._loadDevices(),this._showDropdown=!0}_hideResults(){setTimeout(()=>{this._showDropdown=!1},150)}_selectDevice(t){this._searchValue=t.name,this._showDropdown=!1,this._config={...this._config,device_id:t.id},gt(this,"config-changed",{config:this._config})}_nameChanged(t){if(!this._config||!this.hass)return;const e=t.target.value;this._config={...this._config,name:e},gt(this,"config-changed",{config:this._config})}_toggleChanged(t,e){if(!this._config||!this.hass)return;const i=e.target.checked;this._config={...this._config,[t]:i},gt(this,"config-changed",{config:this._config})}_valueChanged(t){if(!this._config||!this.hass)return;const e=t.target,i=e.configValue;if(this[`_${i}`]===e.value)return;let s;s="checkbox"===e.type?e.checked:e.value,i&&(this._config={...this._config,[i]:s}),gt(this,"config-changed",{config:this._config})}static get styles(){return n`
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
    `}};vt([lt({attribute:!1})],ft.prototype,"hass",void 0),vt([ct()],ft.prototype,"_config",void 0),vt([ct()],ft.prototype,"_helpers",void 0),vt([ct()],ft.prototype,"_searchValue",void 0),vt([ct()],ft.prototype,"_showDropdown",void 0),vt([ct()],ft.prototype,"_filteredDevices",void 0),vt([ct()],ft.prototype,"_allDevices",void 0),ft=vt([rt("alarm-clock-card-editor")],ft)})();