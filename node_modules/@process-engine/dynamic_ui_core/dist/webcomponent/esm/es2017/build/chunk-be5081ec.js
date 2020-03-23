import { h } from '../dynamic-task-components.core.js';

class StringFormField {
    constructor() {
        this.isValid = true;
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
            h("input", { type: 'text', class: 'form-control', id: this.formField.id, name: this.formField.id, value: this.value, onInput: (event) => this._handleChange(event) }));
    }
    _handleChange(event) {
        this.value = event.target.value;
    }
    static get is() { return "string-form-field"; }
    static get properties() { return {
        "value": {
            "state": true
        }
    }; }
    static get style() { return "/**style-placeholder:string-form-field:**/"; }
}

export { StringFormField as a };
