import { KeyCodes } from './key_codes';
export class NumberInputValidator {
    constructor(regex) {
        this._regex = new RegExp(regex);
    }
    isValid(value) {
        return this._regex.test(value);
    }
    validateKey(event) {
        const keyCode = event.keyCode;
        const isCTRLPressed = event.ctrlKey;
        const isCommandPressed = event.metaKey;
        const isEnterPressed = keyCode === KeyCodes.ENTER;
        const isBackspacePressed = keyCode === KeyCodes.BACKSPACE;
        const isKeyCommaPressed = keyCode === KeyCodes.COMMA;
        const isKeyDotPressed = keyCode === KeyCodes.DOT;
        const isMinusKeyPressed = keyCode === KeyCodes.MINUS;
        const isCopyPastePressed = (keyCode === KeyCodes.C || keyCode === KeyCodes.V) && (isCTRLPressed || isCommandPressed);
        const isTabPressed = event.keyCode === KeyCodes.TAB;
        const isValidKey = (keyCode <= KeyCodes.NINE && keyCode >= KeyCodes.ZERO)
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
