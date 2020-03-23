var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "@stencil/core", "./number_input_validator"], function (require, exports, core_1, number_input_validator_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    let NumberFormField = class NumberFormField {
        constructor() {
            this.isValid = true;
            this.validationRegex = '^(-?\\d+(,|\\.)\\d+)|(-?\\d+)$';
            this._numberinputValidator = new number_input_validator_1.NumberInputValidator(this.validationRegex);
        }
        get name() {
            return this.formField.id;
        }
        componentWillLoad() {
            const formFieldDefaultValue = this.formField.defaultValue;
            const parsedDefaultValue = parseFloat(formFieldDefaultValue.replace(',', '.'));
            // eslint-disable-next-line no-restricted-globals
            this.value = isNaN(parsedDefaultValue) ? formFieldDefaultValue : parsedDefaultValue;
        }
        render() {
            return h("div", { class: 'form-group' },
                h("label", null, this.formField.label),
                h("input", { type: 'text', class: 'form-control', id: this.formField.id, name: this.formField.label, placeholder: '0.0', value: this.value, pattern: this.validationRegex, onKeyDown: (event) => this._handleKeyDown(event), onInput: (event) => this._handleInput(event), onChange: (event) => this._handleChange(event) }));
        }
        _handleChange(event) {
            this.isValid = this._numberinputValidator.isValid(event.target.value);
            this._setStyle(event);
        }
        _handleInput(event) {
            const value = event.target.value;
            if (this._numberinputValidator.isValid(value)) {
                this.value = parseFloat(value.replace(',', '.'));
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
    };
    __decorate([
        core_1.State(),
        __metadata("design:type", Number)
    ], NumberFormField.prototype, "value", void 0);
    NumberFormField = __decorate([
        core_1.Component({
            tag: 'number-form-field',
            styleUrl: 'number-form-field.css',
            shadow: false,
        }),
        __metadata("design:paramtypes", [])
    ], NumberFormField);
    exports.NumberFormField = NumberFormField;
});
//# sourceMappingURL=number-form-field.js.map