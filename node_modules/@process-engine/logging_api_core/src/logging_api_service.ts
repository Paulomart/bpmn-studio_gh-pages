import {
  ILoggingApi,
  ILoggingRepository,
  LogEntry,
  LogLevel,
  MetricMeasurementPoint,
} from '@process-engine/logging_api_contracts';

import {IIAMService, IIdentity} from '@essential-projects/iam_contracts';

export class LoggingApiService implements ILoggingApi {

  private iamService: IIAMService;
  private loggingRepository: ILoggingRepository;

  constructor(iamService: IIAMService, loggingRepository: ILoggingRepository) {
    this.iamService = iamService;
    this.loggingRepository = loggingRepository;
  }

  // TODO: Add claim checks as soon as necessary claims have been defined.
  public async readLogForProcessModel(identity: IIdentity, processModelId: string): Promise<Array<LogEntry>> {
    return this.loggingRepository.readLogForProcessModel(processModelId);
  }

  public async writeLogForProcessModel(
    correlationId: string,
    processModelId: string,
    processInstanceId: string,
    logLevel: LogLevel,
    measuredAt: MetricMeasurementPoint,
    message?: string,
    timestamp?: Date,
    error?: Error,
  ): Promise<void> {
    await this
      .loggingRepository
      .writeLogForProcessModel(correlationId, processModelId, processInstanceId, logLevel, measuredAt, message, timestamp, error);
  }

  public async writeLogForFlowNode(
    correlationId: string,
    processModelId: string,
    processInstanceId: string,
    flowNodeInstanceId: string,
    flowNodeId: string,
    logLevel: LogLevel,
    measuredAt: MetricMeasurementPoint,
    tokenPayload: any,
    message?: string,
    timestamp?: Date,
    error?: Error,
  ): Promise<void> {
    await this.loggingRepository.writeLogForFlowNode(
      correlationId,
      processModelId,
      processInstanceId,
      flowNodeInstanceId,
      flowNodeId,
      logLevel,
      measuredAt,
      tokenPayload,
      message,
      timestamp,
      error,
    );
  }

  public async archiveProcessModelLogs(identity: IIdentity, processModelId: string): Promise<void> {
    await this
      .loggingRepository
      .archiveProcessModelLogs(processModelId);
  }

}
