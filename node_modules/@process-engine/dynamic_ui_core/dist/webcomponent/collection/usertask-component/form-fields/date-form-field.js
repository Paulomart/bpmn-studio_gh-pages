import { DateInputValidator } from './date_input_validator';
export class DateFormField {
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
