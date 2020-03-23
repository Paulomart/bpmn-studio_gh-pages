import{h}from"../dynamic-task-components.core.js";var StringFormField=function(){function e(){this.isValid=!0}return Object.defineProperty(e.prototype,"name",{get:function(){return this.formField.id},enumerable:!0,configurable:!0}),e.prototype.componentWillLoad=function(){this.value=this.formField.defaultValue},e.prototype.render=function(){var e=this;return h("div",{class:"form-group"},h("label",{htmlFor:this.formField.id},this.formField.label),h("input",{type:"text",class:"form-control",id:this.formField.id,name:this.formField.id,value:this.value,onInput:function(t){return e._handleChange(t)}}))},e.prototype._handleChange=function(e){this.value=e.target.value},Object.defineProperty(e,"is",{get:function(){return"string-form-field"},enumerable:!0,configurable:!0}),Object.defineProperty(e,"properties",{get:function(){return{value:{state:!0}}},enumerable:!0,configurable:!0}),Object.defineProperty(e,"style",{get:function(){return"/**style-placeholder:string-form-field:**/"},enumerable:!0,configurable:!0}),e}();export{StringFormField as a};