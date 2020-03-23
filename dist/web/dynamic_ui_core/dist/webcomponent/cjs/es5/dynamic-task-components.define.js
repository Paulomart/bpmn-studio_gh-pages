"use strict";
// DynamicTaskComponents: Custom Elements Define Library, ES Module/es5 Target
Object.defineProperty(exports, "__esModule", { value: true });
var dynamic_task_components_core_js_1 = require("./dynamic-task-components.core.js");
var dynamic_task_components_components_js_1 = require("./dynamic-task-components.components.js");
function defineCustomElements(win, opts) {
    return dynamic_task_components_core_js_1.defineCustomElement(win, dynamic_task_components_components_js_1.COMPONENTS, opts);
}
exports.defineCustomElements = defineCustomElements;
