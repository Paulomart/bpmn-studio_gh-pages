import{h}from"../dynamic-task-components.core.js";import{a as NumberInputValidator}from"./chunk-75b119d8.js";var NumberFormField=function(){function e(){this.isValid=!0,this.validationRegex="^(-?\\d+(,|\\.)\\d+)|(-?\\d+)$",this._numberinputValidator=new NumberInputValidator(this.validationRegex)}return Object.defineProperty(e.prototype,"name",{get:function(){return this.formField.id},enumerable:!0,configurable:!0}),e.prototype.componentWillLoad=function(){var e=this.formField.defaultValue,t=parseFloat(e.replace(",","."));this.value=isNaN(t)?e:t},e.prototype.render=function(){var e=this;return h("div",{class:"form-group"},h("label",null,this.formField.label),h("input",{type:"text",class:"form-control",id:this.formField.id,name:this.formField.label,placeholder:"0.0",value:this.value,pattern:this.validationRegex,onKeyDown:function(t){return e._handleKeyDown(t)},onInput:function(t){return e._handleInput(t)},onChange:function(t){return e._handleChange(t)}}))},e.prototype._handleChange=function(e){this.isValid=this._numberinputValidator.isValid(e.target.value),this._setStyle(e)},e.prototype._handleInput=function(e){var t=e.target.value;this._numberinputValidator.isValid(t)?this.value=parseFloat(t.replace(",",".")):e.preventDefault()},e.prototype._setStyle=function(e){var t=0===e.target.value.length;document.getElementById(this.formField.id).style.borderColor=this.isValid||t?"":"red",t&&(this.isValid=!0)},e.prototype._handleKeyDown=function(e){this._numberinputValidator.validateKey(e)||e.preventDefault()},Object.defineProperty(e,"is",{get:function(){return"number-form-field"},enumerable:!0,configurable:!0}),Object.defineProperty(e,"properties",{get:function(){return{value:{state:!0}}},enumerable:!0,configurable:!0}),Object.defineProperty(e,"style",{get:function(){return"/**style-placeholder:number-form-field:**/"},enumerable:!0,configurable:!0}),e}();export{NumberFormField as a};