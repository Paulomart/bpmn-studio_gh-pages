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
    let EnumFormField = class EnumFormField {
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
    };
    __decorate([
        core_1.State(),
        __metadata("design:type", String)
    ], EnumFormField.prototype, "value", void 0);
    EnumFormField = __decorate([
        core_1.Component({
            tag: 'enum-form-field',
            styleUrl: 'enum-form-field.css',
            shadow: true,
        })
    ], EnumFormField);
    exports.EnumFormField = EnumFormField;
});
//# sourceMappingURL=enum-form-field.js.map