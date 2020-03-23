"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-underscore-dangle */
function exposeFunctionForTesting(functionName, functionCallback) {
    const dangerouslyInvokeObjectIsUndefined = window.__dangerouslyInvoke === undefined;
    if (dangerouslyInvokeObjectIsUndefined) {
        window.__dangerouslyInvoke = {};
    }
    window.__dangerouslyInvoke[functionName] = functionCallback;
}
exports.exposeFunctionForTesting = exposeFunctionForTesting;
async function callExposedFunction(webdriverClient, functionName, ...args) {
    const result = await webdriverClient.executeAsync(async (exposedFunctionName, ...params) => {
        const exposedFunctionResult = await window.__dangerouslyInvoke[exposedFunctionName](...params);
        const doneFunctionIndex = params.length - 1;
        const done = params[doneFunctionIndex];
        done(exposedFunctionResult);
    }, functionName, ...args);
    return result;
}
exports.callExposedFunction = callExposedFunction;
