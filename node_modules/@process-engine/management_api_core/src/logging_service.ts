import {IIdentity} from '@essential-projects/iam_contracts';

import {ILoggingApi} from '@process-engine/logging_api_contracts';
import {APIs, DataModels} from '@process-engine/management_api_contracts';

import {applyPagination} from './paginator';

export class LoggingService implements APIs.ILoggingManagementApi {

  private readonly loggingApiService: ILoggingApi;

  constructor(loggingApiService: ILoggingApi) {
    this.loggingApiService = loggingApiService;
  }

  public async getProcessModelLog(
    identity: IIdentity,
    processModelId: string,
    correlationId?: string,
    offset: number = 0,
    limit: number = 0,
  ): Promise<DataModels.Logging.LogEntryList> {

    let logs = await this.loggingApiService.readLogForProcessModel(identity, processModelId);

    if (correlationId) {
      logs = logs.filter((entry: DataModels.Logging.LogEntry): boolean => {
        return entry.correlationId === correlationId;
      });
    }

    const paginizedLogs = applyPagination(logs, offset, limit);

    return {logEntries: paginizedLogs, totalCount: logs.length};
  }

  public async getProcessInstanceLog(
    identity: IIdentity,
    processModelId: string,
    processInstanceId: string,
    offset: number = 0,
    limit: number = 0,
  ): Promise<DataModels.Logging.LogEntryList> {

    const processModelLog = await this.loggingApiService.readLogForProcessModel(identity, processModelId);

    const processInstanceLog =
      processModelLog.filter((logEntry: DataModels.Logging.LogEntry): boolean => {
        return logEntry.processInstanceId === processInstanceId;
      });

    const paginizedLogs = applyPagination(processInstanceLog, offset, limit);

    return {logEntries: paginizedLogs, totalCount: processInstanceLog.length};
  }

}
