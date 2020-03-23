var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "@stencil/core", "./date_input_validator"], function (require, exports, core_1, date_input_validator_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    let DateFormField = class DateFormField {
        constructor() {
            this.isValid = true;
            this.validationRegex = `^(0?[1-9]|[12][0-9]|3[01])([ \\.])(0?[1-9]|1[012])\\2([0-9][0-9][0-9][0-9])(([ -])([0-1]?[0-9]|2[0-3]):[0-5]?[0-9]:[0-5]?[0-9])?$`;
            this._inputValidator = new date_input_validator_1.DateInputValidator();
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
    };
    __decorate([
        core_1.State(),
        __metadata("design:type", String)
    ], DateFormField.prototype, "value", void 0);
    DateFormField = __decorate([
        core_1.Component({
            tag: 'date-form-field',
            styleUrl: 'date-form-field.css',
            shadow: true,
        }),
        __metadata("design:paramtypes", [])
    ], DateFormField);
    exports.DateFormField = DateFormField;
});
//# sourceMappingURL=date-form-field.js.map