import { IDynamicUIApi } from '@process-engine/dynamic_ui_contracts';
export declare class DynamicUIService implements IDynamicUIApi {
    readonly assetsPath: string;
    getIndex(formKey: string): Promise<any>;
    getWebcomponent(formKey: string): Promise<any>;
}
