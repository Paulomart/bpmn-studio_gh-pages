"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@stencil/core");
let ManualTaskComponent = class ManualTaskComponent {
    render() {
        const hasManualTask = this.manualtask !== undefined && this.manualtask !== null;
        if (hasManualTask) {
            return h("div", { class: 'card form_card' },
                h("div", { class: 'card-body' },
                    h("h3", { class: 'card-title' }, this.manualtask.name),
                    h("br", null),
                    h("div", { class: 'float-right' },
                        h("button", { type: 'button', class: 'btn btn-secondary', onClick: (e) => this._handleCancel(e), id: 'dynamic-ui-wrapper-cancel-button' }, "Cancel"),
                        "\u00A0",
                        h("button", { type: 'button', class: 'btn btn-primary', onClick: (e) => this._handleContinue(e), id: 'dynamic-ui-wrapper-continue-button' }, "Continue"))));
        }
        else {
            return h("div", { class: 'card form_card' },
                h("div", { class: 'card-body' },
                    h("h3", { class: 'card-title mb-0' }, "ManualTask finished.")));
        }
    }
    _handleContinue(event) {
        this.continued.emit({
            correlationId: this.manualtask.correlationId,
            processInstanceId: this.manualtask.processInstanceId,
            manualTaskId: this.manualtask.id,
            manualTaskInstanceId: this.manualtask.flowNodeInstanceId,
        });
    }
    _handleCancel(event) {
        this.canceled.emit();
    }
};
__decorate([
    core_1.Prop(),
    __metadata("design:type", Object)
], ManualTaskComponent.prototype, "manualtask", void 0);
__decorate([
    core_1.Event(),
    __metadata("design:type", Object)
], ManualTaskComponent.prototype, "continued", void 0);
__decorate([
    core_1.Event(),
    __metadata("design:type", Object)
], ManualTaskComponent.prototype, "canceled", void 0);
ManualTaskComponent = __decorate([
    core_1.Component({
        tag: 'manualtask-component',
        styleUrl: 'manualtask-component.css',
        shadow: false,
    })
], ManualTaskComponent);
exports.ManualTaskComponent = ManualTaskComponent;
//# sourceMappingURL=manualtask-component.js.map