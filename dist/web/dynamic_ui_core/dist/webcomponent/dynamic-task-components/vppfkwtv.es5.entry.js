DynamicTaskComponents.loadBundle("vppfkwtv",["exports"],function(n){var e=window.DynamicTaskComponents.h,t=function(){function n(){}return n.prototype.render=function(){var n=this;return e("div",{class:"card form_card"},null!=this.manualtask?e("div",{class:"card-body"},e("h3",{class:"card-title"},this.manualtask.name),e("br",null),e("div",{class:"float-right"},e("button",{type:"button",class:"btn btn-secondary",onClick:function(e){return n._handleCancel(e)},id:"dynamic-ui-wrapper-cancel-button"},"Cancel")," ",e("button",{type:"button",class:"btn btn-primary",onClick:function(e){return n._handleContinue(e)},id:"dynamic-ui-wrapper-continue-button"},"Continue"))):e("div",{class:"card-body"},e("h3",{class:"card-title mb-0"},"ManualTask finished.")))},n.prototype._handleContinue=function(n){this.continued.emit({correlationId:this.manualtask.correlationId,processInstanceId:this.manualtask.processInstanceId,manualTaskId:this.manualtask.id,manualTaskInstanceId:this.manualtask.flowNodeInstanceId})},n.prototype._handleCancel=function(n){this.canceled.emit()},Object.defineProperty(n,"is",{get:function(){return"manualtask-component"},enumerable:!0,configurable:!0}),Object.defineProperty(n,"properties",{get:function(){return{manualtask:{type:"Any",attr:"manualtask"}}},enumerable:!0,configurable:!0}),Object.defineProperty(n,"events",{get:function(){return[{name:"continued",method:"continued",bubbles:!0,cancelable:!0,composed:!0},{name:"canceled",method:"canceled",bubbles:!0,cancelable:!0,composed:!0}]},enumerable:!0,configurable:!0}),Object.defineProperty(n,"style",{get:function(){return""},enumerable:!0,configurable:!0}),n}();n.ManualtaskComponent=t,Object.defineProperty(n,"__esModule",{value:!0})});