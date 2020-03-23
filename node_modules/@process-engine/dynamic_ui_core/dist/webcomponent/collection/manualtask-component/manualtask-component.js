export class ManualTaskComponent {
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
    static get is() { return "manualtask-component"; }
    static get properties() { return {
        "manualtask": {
            "type": "Any",
            "attr": "manualtask"
        }
    }; }
    static get events() { return [{
            "name": "continued",
            "method": "continued",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }, {
            "name": "canceled",
            "method": "canceled",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }]; }
    static get style() { return "/**style-placeholder:manualtask-component:**/"; }
}
