import { EventEmitter } from '@stencil/core';
import { IUserTask } from '.';
export declare class DynamicUserTaskComponent {
    usertask: IUserTask;
    submitted: EventEmitter;
    canceled: EventEmitter;
    private _formFieldComponentsForTyp;
    private _formFields;
    constructor();
    componentWillLoad(): void;
    watchUserTaskHandler(newUserTask: IUserTask, oldUserTask: IUserTask): void;
    render(): any;
    private _renderConfirmUserTask;
    private _renderUserTask;
    private _handleSubmit;
    private _handleProceed;
    private _handleDecline;
    private _handleCancel;
    private _isInputValid;
    private _getFormResults;
    private _getConfirmResult;
    private _createComponentForFormField;
}
