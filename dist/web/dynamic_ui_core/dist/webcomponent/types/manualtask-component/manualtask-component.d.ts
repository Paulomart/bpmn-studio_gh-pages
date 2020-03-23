import { EventEmitter } from '../stencil.core';
import { IManualTask } from './imanualtask';
export declare class ManualTaskComponent {
    manualtask: IManualTask;
    continued: EventEmitter;
    canceled: EventEmitter;
    render(): any;
    private _handleContinue;
    private _handleCancel;
}
