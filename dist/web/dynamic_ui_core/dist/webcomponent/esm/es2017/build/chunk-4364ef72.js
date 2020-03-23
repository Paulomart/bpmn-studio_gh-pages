import { h } from '../dynamic-task-components.core.js';

class BooleanFormField {
    constructor() {
        this.isValid = true;
    }
    get name() {
        return this.formField.id;
    }
    componentWillLoad() {
        this.value = this.formField.defaultValue === 'true' || this.formField.defaultValue === '1' || this.formField.defaultValue === true;
    }
    render() {
        return h("div", { class: 'form-check' },
            h("input", { class: 'form-check-input', id: this.formField.id, type: 'checkbox', checked: this.value, onInput: (event) => this._handleClick(event) }),
            h("label", { class: 'form-check-label', htmlFor: this.formField.id }, this.formField.label));
    }
    _handleClick(event) {
        this.value = event.target.checked === true;
    }
    static get is() { return "boolean-form-field"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "value": {
            "state": true
        }
    }; }
    static get style() { return "/**style-placeholder:boolean-form-field:**/"; }
}

export { BooleanFormField as a };
