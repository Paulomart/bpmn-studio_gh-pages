define(["require", "exports", "./key_codes"], function (require, exports, key_codes_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class NumberInputValidator {
        constructor(regex) {
            this._regex = new RegExp(regex);
        }
        isValid(value) {
            return this._regex.test(value);
        }
        validateKey(event) {
            /* tslint:disable:cyclomatic-complexity */
            const keyCode = event.keyCode;
            const isCTRLPressed = event.ctrlKey;
            const isCommandPressed = event.metaKey;
            const isEnterPressed = keyCode === key_codes_1.KeyCodes.ENTER;
            const isBackspacePressed = keyCode === key_codes_1.KeyCodes.BACKSPACE;
            const isKeyCommaPressed = keyCode === key_codes_1.KeyCodes.COMMA;
            const isKeyDotPressed = keyCode === key_codes_1.KeyCodes.DOT;
            const isMinusKeyPressed = keyCode === key_codes_1.KeyCodes.MINUS;
            const isCopyPastePressed = (keyCode === key_codes_1.KeyCodes.C || keyCode === key_codes_1.KeyCodes.V) && (isCTRLPressed || isCommandPressed);
            const isTabPressed = event.keyCode === key_codes_1.KeyCodes.TAB;
            const isValidKey = (keyCode <= key_codes_1.KeyCodes.NINE && keyCode >= key_codes_1.KeyCodes.ZERO)
                || isBackspacePressed
                || isEnterPressed
                || isKeyCommaPressed
                || isKeyDotPressed
                || isCopyPastePressed
                || isMinusKeyPressed
                || isTabPressed;
            return isValidKey;
        }
    }
    exports.NumberInputValidator = NumberInputValidator;
});
//# sourceMappingURL=number_input_validator.js.map