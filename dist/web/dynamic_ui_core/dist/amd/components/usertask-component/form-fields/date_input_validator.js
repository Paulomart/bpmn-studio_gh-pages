define(["require", "exports", "./key_codes"], function (require, exports, key_codes_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class DateInputValidator {
        validateKey(event) {
            const isEnterPressed = event.keyCode === key_codes_1.KeyCodes.ENTER;
            const isBackspacePressed = event.keyCode === key_codes_1.KeyCodes.BACKSPACE;
            const isDotPosition = event.target.value.length === 2 || event.target.value.length === 5;
            const isCopyPastePressed = this.isCopyAndPastePressed(event);
            const isValidKey = this.isKeyValid(event, isBackspacePressed, isCopyPastePressed);
            const isTabPressed = event.keyCode === key_codes_1.KeyCodes.TAB;
            if (isTabPressed) {
                return true;
            }
            if (isEnterPressed) {
                return this.isValidDate(event.target.value);
            }
            if (isDotPosition) {
                if (isBackspacePressed) {
                    return true;
                }
                else {
                    event.target.value = event.target.value.concat('.');
                }
            }
            return isValidKey;
        }
        isValidDate(value) {
            const year = parseInt(value.substring(6, 10));
            const month = parseInt(value.substring(3, 5));
            const day = parseInt(value.substring(0, 2));
            return this.isDayInMonth(day, month, year);
        }
        isDayInMonth(day, month, year) {
            const numberOfDaysInSelectedMonth = new Date(year, month, 0).getDate();
            const isGivenDayInMonth = day <= numberOfDaysInSelectedMonth;
            return isGivenDayInMonth;
        }
        isCopyAndPastePressed(event) {
            return (event.keyCode === key_codes_1.KeyCodes.C || event.keyCode === key_codes_1.KeyCodes.V) && (event.ctrlKey || event.metaKey);
        }
        isKeyValid(event, isBackspacePressed, isCopyPastePressed) {
            return (event.keyCode <= key_codes_1.KeyCodes.NINE && event.keyCode >= key_codes_1.KeyCodes.ZERO)
                || isBackspacePressed
                || isCopyPastePressed;
        }
    }
    exports.DateInputValidator = DateInputValidator;
});
//# sourceMappingURL=date_input_validator.js.map