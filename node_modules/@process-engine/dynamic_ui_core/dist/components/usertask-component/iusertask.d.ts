import { DataModels } from '@process-engine/consumer_api_contracts';
export interface IUserTask {
    id: string;
    flowNodeInstanceId?: string;
    name: string;
    correlationId: string;
    processInstanceId?: string;
    processModelId: string;
    data: DataModels.UserTasks.UserTaskConfig;
    tokenPayload: any;
}
