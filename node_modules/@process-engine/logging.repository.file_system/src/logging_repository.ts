import {
  ILoggingRepository,
  ILoggingRepositoryConfig,
  LogEntry,
  LogLevel,
  MetricMeasurementPoint,
} from '@process-engine/logging_api_contracts';

import * as moment from 'moment';
import * as path from 'path';

import * as Serializer from './adapter/serializer';
import * as FileSystemAdapter from './adapter/file_system_adapter';

export class LoggingRepository implements ILoggingRepository {

  public config: ILoggingRepositoryConfig;

  public async readLogForProcessModel(processModelId: string): Promise<Array<LogEntry>> {

    const fileNameWithExtension = `${processModelId}.log`;

    const logFilePath = this.buildPath(fileNameWithExtension);

    const logFileExists = FileSystemAdapter.targetExists(logFilePath);
    if (!logFileExists) {
      return [];
    }

    const correlationLogs = FileSystemAdapter.readAndParseFile(logFilePath);

    return correlationLogs;
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

    const timeStampAsIsoString = moment(timestamp).toISOString();

    const logEntryValues = [
      'ProcessModel_V2',
      timeStampAsIsoString,
      correlationId,
      processModelId,
      processInstanceId,
      '',
      '',
      logLevel,
      message,
      measuredAt,
      '',
      error ? Serializer.serialize(error) : '',
    ];

    await this.writeLogEntryToFileSystem(processModelId, ...logEntryValues);
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

    const timeStampAsIsoString = moment(timestamp).toISOString();

    const logEntryValues = [
      'FlowNodeInstance_V2',
      timeStampAsIsoString,
      correlationId,
      processModelId,
      processInstanceId,
      flowNodeInstanceId,
      flowNodeId,
      logLevel,
      message || '',
      measuredAt,
      tokenPayload ? JSON.stringify(tokenPayload) : '',
      error ? Serializer.serialize(error) : '',
    ];

    await this.writeLogEntryToFileSystem(processModelId, ...logEntryValues);
  }

  public async archiveProcessModelLogs(processModelId: string): Promise<void> {

    const fileNameWithExtension = `${processModelId}.log`;

    const targetFilePath = this.buildPath(fileNameWithExtension);

    const processModelHasNoLogs = !FileSystemAdapter.targetExists(targetFilePath);
    if (processModelHasNoLogs) {
      return;
    }

    const archiveFolderToUse = this.config.archive_path
      ? path.resolve(path.normalize(this.config.archive_path))
      : path.resolve(this.config.output_path, 'archive');

    await FileSystemAdapter.moveLogFileToArchive(archiveFolderToUse, targetFilePath);
  }

  private async writeLogEntryToFileSystem(processModelId: string, ...values: Array<string>): Promise<void> {

    const fileNameWithExtension = `${processModelId}.log`;

    const targetFilePath = this.buildPath(fileNameWithExtension);

    const loggingEntryAsString = this.buildLoggingString(...values);

    await FileSystemAdapter.ensureDirectoryExists(targetFilePath);
    await FileSystemAdapter.writeToLogFile(targetFilePath, loggingEntryAsString);
  }

  private buildPath(...pathSegments: Array<string>): string {
    return path.resolve(process.cwd(), this.config.output_path, ...pathSegments);
  }

  private buildLoggingString(...args: Array<string>): string {
    return args.join(';');
  }

}
