import{a as KeyCodes}from"./chunk-d8a0f336.js";var NumberInputValidator=function(){function e(e){this._regex=new RegExp(e)}return e.prototype.isValid=function(e){return this._regex.test(e)},e.prototype.validateKey=function(e){var o=e.keyCode;return o<=KeyCodes.NINE&&o>=KeyCodes.ZERO||o===KeyCodes.BACKSPACE||o===KeyCodes.ENTER||o===KeyCodes.COMMA||o===KeyCodes.DOT||(o===KeyCodes.C||o===KeyCodes.V)&&(e.ctrlKey||e.metaKey)||o===KeyCodes.MINUS||e.keyCode===KeyCodes.TAB},e}();export{NumberInputValidator as a};