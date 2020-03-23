"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dynamic_task_components_core_js_1 = require("../dynamic-task-components.core.js");
var BooleanFormField = function () { function e() { this.isValid = !0; } return Object.defineProperty(e.prototype, "name", { get: function () { return this.formField.id; }, enumerable: !0, configurable: !0 }), e.prototype.componentWillLoad = function () { this.value = "true" === this.formField.defaultValue || "1" === this.formField.defaultValue || !0 === this.formField.defaultValue; }, e.prototype.render = function () { var e = this; return dynamic_task_components_core_js_1.h("div", { class: "form-check" }, dynamic_task_components_core_js_1.h("input", { class: "form-check-input", id: this.formField.id, type: "checkbox", checked: this.value, onInput: function (t) { return e._handleClick(t); } }), dynamic_task_components_core_js_1.h("label", { class: "form-check-label", htmlFor: this.formField.id }, this.formField.label)); }, e.prototype._handleClick = function (e) { this.value = !0 === e.target.checked; }, Object.defineProperty(e, "is", { get: function () { return "boolean-form-field"; }, enumerable: !0, configurable: !0 }), Object.defineProperty(e, "encapsulation", { get: function () { return "shadow"; }, enumerable: !0, configurable: !0 }), Object.defineProperty(e, "properties", { get: function () { return { value: { state: !0 } }; }, enumerable: !0, configurable: !0 }), Object.defineProperty(e, "style", { get: function () { return "/**style-placeholder:boolean-form-field:**/"; }, enumerable: !0, configurable: !0 }), e; }();
exports.a = BooleanFormField;
