import { DataModels } from '@process-engine/consumer_api_contracts';
import { IFormField } from './iform_field';
export declare class NumberFormField implements IFormField {
    value: number;
    formField: DataModels.UserTasks.UserTaskFormField;
    isValid: boolean;
    private _numberinputValidator;
    private readonly validationRegex;
    constructor();
    readonly name: string;
    componentWillLoad(): void;
    render(): JSX.Element;
    private _handleChange;
    private _handleInput;
    private _setStyle;
    private _handleKeyDown;
}
