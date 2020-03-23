var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "@stencil/core"], function (require, exports, core_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    let BooleanFormField = class BooleanFormField {
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
    };
    __decorate([
        core_1.State(),
        __metadata("design:type", Boolean)
    ], BooleanFormField.prototype, "value", void 0);
    BooleanFormField = __decorate([
        core_1.Component({
            tag: 'boolean-form-field',
            styleUrl: 'boolean-form-field.css',
            shadow: true,
        })
    ], BooleanFormField);
    exports.BooleanFormField = BooleanFormField;
});
//# sourceMappingURL=boolean-form-field.js.map