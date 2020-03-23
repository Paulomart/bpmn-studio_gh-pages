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
    let StringFormField = class StringFormField {
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
    };
    __decorate([
        core_1.State(),
        __metadata("design:type", String)
    ], StringFormField.prototype, "value", void 0);
    StringFormField = __decorate([
        core_1.Component({
            tag: 'string-form-field',
            styleUrl: 'string-form-field.css',
            shadow: false,
        })
    ], StringFormField);
    exports.StringFormField = StringFormField;
});
//# sourceMappingURL=string-form-field.js.map