export class EnumFormField {
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
            h("label", null, this.formField.label),
            h("select", { class: 'form-control', id: this.formField.id, name: this.formField.label, onInput: (event) => this._handleSelect(event) }, this.formField.enumValues.map((enumValue) => {
                return h("option", { value: enumValue.id, selected: this.value === enumValue.id }, enumValue.name);
            })));
    }
    _handleSelect(event) {
        this.value = event.target.value;
    }
    static get is() { return "enum-form-field"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "value": {
            "state": true
        }
    }; }
    static get style() { return "/**style-placeholder:enum-form-field:**/"; }
}
