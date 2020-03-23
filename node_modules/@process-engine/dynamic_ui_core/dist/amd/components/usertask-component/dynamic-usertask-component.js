var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "@stencil/core", "."], function (require, exports, core_1, _1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    let DynamicUserTaskComponent = class DynamicUserTaskComponent {
        constructor() {
            this._formFieldComponentsForTyp = [];
            this._formFields = [];
            this._formFieldComponentsForTyp['string'] = _1.StringFormField;
            this._formFieldComponentsForTyp['long'] = _1.LongFormField;
            this._formFieldComponentsForTyp['number'] = _1.NumberFormField;
            this._formFieldComponentsForTyp['boolean'] = _1.BooleanFormField;
            this._formFieldComponentsForTyp['decimal'] = _1.NumberFormField;
            this._formFieldComponentsForTyp['date'] = _1.DateFormField;
            this._formFieldComponentsForTyp['enum'] = _1.EnumFormField;
        }
        componentWillLoad() {
            this.watchUserTaskHandler(this.usertask, undefined);
        }
        watchUserTaskHandler(newUserTask, oldUserTask) {
            this._formFields = [];
            const hasUserTask = newUserTask !== undefined && newUserTask !== null;
            if (hasUserTask) {
                for (const formField of newUserTask.data.formFields) {
                    const component = this._createComponentForFormField(formField);
                    component.componentWillLoad();
                    this._formFields.push(component);
                }
            }
        }
        render() {
            const hasUserTask = this.usertask !== undefined && this.usertask !== null;
            if (hasUserTask) {
                const isConfirmUserTask = this.usertask.data.preferredControl === 'confirm';
                if (isConfirmUserTask) {
                    return this._renderConfirmUserTask();
                }
                else {
                    return this._renderUserTask();
                }
            }
            else {
                return h("div", { class: 'card form_card' },
                    h("div", { class: 'card-body' },
                        h("h3", { class: 'card-title mb-0' }, "UserTask finished.")));
            }
        }
        _renderConfirmUserTask() {
            const firstBooleanFormField = this.usertask.data.formFields.find((formField) => {
                return formField.type === 'boolean';
            });
            const indexOfFormField = this.usertask.data.formFields.indexOf(firstBooleanFormField);
            this._formFields.splice(indexOfFormField, 1);
            return h("div", { class: 'card form_card' },
                h("div", { class: 'card-body' },
                    h("h3", { class: 'card-title' }, this.usertask.name),
                    this._formFields.map((formField) => {
                        return formField.render();
                    }),
                    h("p", null, firstBooleanFormField.label),
                    h("br", null),
                    h("div", { class: 'float-right' },
                        h("button", { type: 'button', class: 'btn btn-secondary', onClick: (e) => this._handleCancel(e), id: 'dynamic-ui-wrapper-cancel-button' }, "Cancel"),
                        "\u00A0",
                        h("button", { type: 'button', class: 'btn btn-danger', onClick: (e) => this._handleDecline(e), id: 'dynamic-ui-wrapper-decline-button' }, "Decline"),
                        "\u00A0",
                        h("button", { type: 'button', class: 'btn btn-success', onClick: (e) => this._handleProceed(e), id: 'dynamic-ui-wrapper-proceed-button' }, "Proceed"))));
        }
        _renderUserTask() {
            return h("div", { class: 'card form_card' },
                h("div", { class: 'card-body' },
                    h("h3", { class: 'card-title' }, this.usertask.name),
                    h("form", { onSubmit: (e) => this._handleSubmit(e) },
                        this._formFields.map((formField) => {
                            return formField.render();
                        }),
                        h("br", null),
                        h("div", { class: 'float-right' },
                            h("button", { type: 'button', class: 'btn btn-secondary', onClick: (e) => this._handleCancel(e), id: 'dynamic-ui-wrapper-cancel-button' }, "Cancel"),
                            "\u00A0",
                            h("button", { type: 'submit', class: 'btn btn-primary', id: 'dynamic-ui-wrapper-continue-button' }, "Continue")))));
        }
        _handleSubmit(event) {
            event.preventDefault();
            const inputIsValid = this._isInputValid();
            if (inputIsValid) {
                this.submitted.emit({
                    correlationId: this.usertask.correlationId,
                    processInstanceId: this.usertask.processInstanceId,
                    userTaskId: this.usertask.id,
                    flowNodeInstanceId: this.usertask.flowNodeInstanceId,
                    results: this._getFormResults(),
                });
            }
        }
        _handleProceed(event) {
            this.submitted.emit({
                correlationId: this.usertask.correlationId,
                processInstanceId: this.usertask.processInstanceId,
                userTaskId: this.usertask.id,
                flowNodeInstanceId: this.usertask.flowNodeInstanceId,
                results: this._getConfirmResult(true),
            });
        }
        _handleDecline(event) {
            this.submitted.emit({
                correlationId: this.usertask.correlationId,
                processInstanceId: this.usertask.processInstanceId,
                userTaskId: this.usertask.id,
                flowNodeInstanceId: this.usertask.flowNodeInstanceId,
                results: this._getConfirmResult(false),
            });
        }
        _handleCancel(event) {
            this.canceled.emit();
        }
        _isInputValid() {
            for (const formField of this._formFields) {
                const formFieldInputIsInvalid = !formField.isValid;
                if (formFieldInputIsInvalid) {
                    return false;
                }
            }
            return true;
        }
        _getFormResults() {
            const result = { formFields: {} };
            for (const formField of this._formFields) {
                result.formFields[formField.name] = formField.value;
            }
            return result;
        }
        _getConfirmResult(proceedClicked) {
            const result = { formFields: {} };
            const firstBooleanFormField = this.usertask.data.formFields.find((formField) => {
                return formField.type === 'boolean';
            });
            for (const formField of this._formFields) {
                result.formFields[formField.name] = formField.value;
            }
            result.formFields[firstBooleanFormField.id] = proceedClicked;
            return result;
        }
        _createComponentForFormField(formField) {
            const type = this._formFieldComponentsForTyp[formField.type];
            const component = new type();
            component.formField = formField;
            component.value = formField.defaultValue;
            return component;
        }
    };
    __decorate([
        core_1.Prop(),
        __metadata("design:type", Object)
    ], DynamicUserTaskComponent.prototype, "usertask", void 0);
    __decorate([
        core_1.Event(),
        __metadata("design:type", Object)
    ], DynamicUserTaskComponent.prototype, "submitted", void 0);
    __decorate([
        core_1.Event(),
        __metadata("design:type", Object)
    ], DynamicUserTaskComponent.prototype, "canceled", void 0);
    __decorate([
        core_1.Watch('usertask'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", void 0)
    ], DynamicUserTaskComponent.prototype, "watchUserTaskHandler", null);
    DynamicUserTaskComponent = __decorate([
        core_1.Component({
            tag: 'dynamic-usertask-component',
            styleUrl: 'dynamic-usertask-component.css',
            shadow: false,
        }),
        __metadata("design:paramtypes", [])
    ], DynamicUserTaskComponent);
    exports.DynamicUserTaskComponent = DynamicUserTaskComponent;
});
//# sourceMappingURL=dynamic-usertask-component.js.map