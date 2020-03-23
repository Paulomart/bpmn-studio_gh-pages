import { DataModels } from '@process-engine/consumer_api_contracts';
import { IFormField } from './iform_field';
export declare class DateFormField implements IFormField {
    value: string;
    formField: DataModels.UserTasks.UserTaskFormField;
    isValid: boolean;
    private readonly _inputValidator;
    private readonly validationRegex;
    constructor();
    readonly name: string;
    componentWillLoad(): void;
    render(): any;
    private _handleChange;
    private _setStyle;
    private _handleKeyDown;
}
