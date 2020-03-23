import { NumberInputValidator } from './number_input_validator';
export class LongFormField {
    constructor() {
        this.isValid = true;
        this.validationRegex = '^-?\\d+$';
        this._numberinputValidator = new NumberInputValidator(this.validationRegex);
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
            h("input", { type: 'text', class: 'form-control', id: this.formField.id, name: this.formField.label, value: this.value, placeholder: '0', pattern: this.validationRegex, onKeyDown: (event) => this._handleKeyDown(event), onInput: (event) => this._handleInput(event), onChange: (event) => this._handleChange(event) }));
    }
    _handleChange(event) {
        this.isValid = this._numberinputValidator.isValid(event.target.value);
        this._setStyle(event);
    }
    _handleInput(event) {
        const value = event.target.value;
        if (this._numberinputValidator.isValid(value)) {
            this.value = parseInt(value);
        }
        else {
            event.preventDefault();
        }
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
        const isValidInput = this._numberinputValidator.validateKey(event);
        if (isValidInput) {
            return;
        }
        event.preventDefault();
    }
    static get is() { return "long-form-field"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "value": {
            "state": true
        }
    }; }
    static get style() { return "/**style-placeholder:long-form-field:**/"; }
}
