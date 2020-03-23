import { DataModels } from '@process-engine/consumer_api_contracts';
import { IFormField } from './iform_field';
export declare class EnumFormField implements IFormField {
    value: string;
    isValid: boolean;
    formField: DataModels.UserTasks.UserTaskFormField;
    readonly name: string;
    componentWillLoad(): void;
    render(): any;
    _handleSelect(event: any): void;
}
