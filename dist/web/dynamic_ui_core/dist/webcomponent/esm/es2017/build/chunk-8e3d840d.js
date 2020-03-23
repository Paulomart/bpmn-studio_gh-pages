import { h } from '../dynamic-task-components.core.js';

import { a as KeyCodes } from './chunk-d8a0f336.js';

class DateInputValidator {
    validateKey(event) {
        const isEnterPressed = event.keyCode === KeyCodes.ENTER;
        const isBackspacePressed = event.keyCode === KeyCodes.BACKSPACE;
        const isDotPosition = event.target.value.length === 2 || event.target.value.length === 5;
        const isCopyPastePressed = this.isCopyAndPastePressed(event);
        const isValidKey = this.isKeyValid(event, isBackspacePressed, isCopyPastePressed);
        const isTabPressed = event.keyCode === KeyCodes.TAB;
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
        return (event.keyCode === KeyCodes.C || event.keyCode === KeyCodes.V) && (event.ctrlKey || event.metaKey);
    }
    isKeyValid(event, isBackspacePressed, isCopyPastePressed) {
        return (event.keyCode <= KeyCodes.NINE && event.keyCode >= KeyCodes.ZERO)
            || isBackspacePressed
            || isCopyPastePressed;
    }
}

class DateFormField {
    constructor() {
        this.isValid = true;
        this.validationRegex = `^(0?[1-9]|[12][0-9]|3[01])([ \\.])(0?[1-9]|1[012])\\2([0-9][0-9][0-9][0-9])(([ -])([0-1]?[0-9]|2[0-3]):[0-5]?[0-9]:[0-5]?[0-9])?$`;
        this._inputValidator = new DateInputValidator();
    }
    get name() {
        return this.formField.id;
    }
    componentWillLoad() {
        this.value = this.formField.defaultValue;
    }
    render() {
        return h("div", { class: 'form-group' },
            h("label", { htmlFor: this.formField.id }, this.formField.label),
            h("input", { type: 'text', "data-provide": 'datepicker', class: 'form-control', maxlength: '10', placeholder: '--.--.----', pattern: this.validationRegex, id: this.formField.id, value: this.value, onChange: (event) => this._handleChange(event), onKeyDown: (event) => this._handleKeyDown(event) }));
    }
    _handleChange(event) {
        this.value = event.target.value;
        this.isValid = this._inputValidator.isValidDate(event.target.value);
        this._setStyle(event);
    }
    _setStyle(event) {
        const isEmptyInput = event.target.value.length === 0;
        const element = document.getElementById(this.formField.id);
        element.style.borderColor = (this.isValid || isEmptyInput) ? '' : 'red';
        if (isEmptyInput) {
            this.isValid = true;
        }
    }
    _handleKeyDown(event) {
        const isValidInput = this._inputValidator.validateKey(event);
        if (isValidInput) {
            return;
        }
        event.preventDefault();
    }
    static get is() { return "date-form-field"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "value": {
            "state": true
        }
    }; }
    static get style() { return "/**style-placeholder:date-form-field:**/"; }
}

export { DateFormField as a };
