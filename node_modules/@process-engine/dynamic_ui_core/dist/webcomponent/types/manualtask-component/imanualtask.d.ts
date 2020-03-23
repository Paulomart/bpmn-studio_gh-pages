export interface IManualTask {
    id: string;
    name: string;
    correlationId: string;
    processModelId: string;
    tokenPayload: any;
    flowNodeInstanceId?: string;
    processInstanceId?: string;
}
