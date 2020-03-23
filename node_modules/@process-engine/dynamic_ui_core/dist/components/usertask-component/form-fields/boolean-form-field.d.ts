import { DataModels } from '@process-engine/consumer_api_contracts';
import { IFormField } from './iform_field';
export declare class BooleanFormField implements IFormField {
    formField: DataModels.UserTasks.UserTaskFormField;
    isValid: boolean;
    readonly name: string;
    value: boolean;
    componentWillLoad(): void;
    render(): any;
    private _handleClick;
}
