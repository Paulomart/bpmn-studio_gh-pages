import { BooleanFormField, DateFormField, EnumFormField, LongFormField, NumberFormField, StringFormField, } from '.';
export class DynamicUserTaskComponent {
    constructor() {
        this._formFieldComponentsForTyp = [];
        this._formFields = [];
        this._formFieldComponentsForTyp['string'] = StringFormField;
        this._formFieldComponentsForTyp['long'] = LongFormField;
        this._formFieldComponentsForTyp['number'] = NumberFormField;
        this._formFieldComponentsForTyp['boolean'] = BooleanFormField;
        this._formFieldComponentsForTyp['decimal'] = NumberFormField;
        this._formFieldComponentsForTyp['date'] = DateFormField;
        this._formFieldComponentsForTyp['enum'] = EnumFormField;
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
    static get is() { return "dynamic-usertask-component"; }
    static get properties() { return {
        "usertask": {
            "type": "Any",
            "attr": "usertask",
            "watchCallbacks": ["watchUserTaskHandler"]
        }
    }; }
    static get events() { return [{
            "name": "submitted",
            "method": "submitted",
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
    static get style() { return "/**style-placeholder:dynamic-usertask-component:**/"; }
}
