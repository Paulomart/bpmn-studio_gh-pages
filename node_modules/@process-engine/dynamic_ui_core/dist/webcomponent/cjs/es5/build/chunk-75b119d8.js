"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chunk_d8a0f336_js_1 = require("./chunk-d8a0f336.js");
var NumberInputValidator = function () { function e(e) { this._regex = new RegExp(e); } return e.prototype.isValid = function (e) { return this._regex.test(e); }, e.prototype.validateKey = function (e) { var o = e.keyCode; return o <= chunk_d8a0f336_js_1.a.NINE && o >= chunk_d8a0f336_js_1.a.ZERO || o === chunk_d8a0f336_js_1.a.BACKSPACE || o === chunk_d8a0f336_js_1.a.ENTER || o === chunk_d8a0f336_js_1.a.COMMA || o === chunk_d8a0f336_js_1.a.DOT || (o === chunk_d8a0f336_js_1.a.C || o === chunk_d8a0f336_js_1.a.V) && (e.ctrlKey || e.metaKey) || o === chunk_d8a0f336_js_1.a.MINUS || e.keyCode === chunk_d8a0f336_js_1.a.TAB; }, e; }();
exports.a = NumberInputValidator;
