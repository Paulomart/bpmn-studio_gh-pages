
// DynamicTaskComponents: Custom Elements Define Library, ES Module/es2017 Target

import { defineCustomElement } from './dynamic-task-components.core.js';
import { COMPONENTS } from './dynamic-task-components.components.js';

export function defineCustomElements(win, opts) {
  return defineCustomElement(win, COMPONENTS, opts);
}
