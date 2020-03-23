import {IIdentity} from '@essential-projects/iam_contracts';

import {LogEntry} from './log_entry';
import {LogLevel} from './log_level';
import {MetricMeasurementPoint} from './metric_measurement_point';

/**
 * Contains functions for writing and retrieving content from logfiles.
 * Each logfile relates to a specific ProcessModel and Correlation.
 */
export interface ILoggingApi {

  /**
   * Retrieves the logs for a specific ProcessModel of a given Correlation.
   * @async
   * @param identity       The identity of the requesting user.
   * @param processModelId The ID of ProcessModel for which to retrieve
   *                       the logs.
   *                       If not set, all logs will be returned.
   * @returns              A list of log entries.
   */
  readLogForProcessModel(identity: IIdentity, processModelId: string): Promise<Array<LogEntry>>;

  /**
   * Writes a log entry for a specific ProcessModel of a Correlation.
   * @async
   * @param correlationId     The ID of the Correlation to which the
   *                          ProcessModel belongs.
   * @param processModelId    The ID of ProcessModel for which to create a
   *                          log entry.
   * @param processInstanceId The instance ID of the ProcessModel.
   * @param logLevel          The loglevel to use.
   * @param measuredAt        The type of log (OnEnter, OnExit, etc).
   * @param message           Optional: A message for the LogEntry.
   * @param timestamp         Optional: The timestamp to use for the log entry.
   *                          Defaults to "now".
   * @param error             Optional: An error to attach to the log.
   */
  writeLogForProcessModel(
    correlationId: string,
    processModelId: string,
    processInstanceId: string,
    logLevel: LogLevel,
    measuredAt: MetricMeasurementPoint,
    message?: string,
    timestamp?: Date,
    error?: Error,
  ): Promise<void>;

  /**
   * Writes a log entry for a specific FlowNode of a ProcessModel within a
   * Correlation.
   * @async
   * @param correlationId      The ID of the Correlation to which the
   *                           ProcessModel belongs.
   * @param processModelId     The ID of ProcessModel to which the FlowNode
   *                           belongs.
   * @param processInstanceId  The instance ID of the ProcessModel.
   * @param flowNodeInstanceId The instance ID of FlowNode for which to create
   *                           a log entry.
   * @param flowNodeId         The ID of FlowNode for which to create a
   *                           log entry.
   * @param logLevel           The loglevel to use.
   * @param measuredAt         The type of log (OnEnter, OnExit, etc).
   * @param message            Optional: The message to write into the log entry.
   * @param tokenPayload       The payload of the FlowNodeInstance's current token.
   * @param timestamp          Optional: The timestamp to use for the log entry.
   *                           Defaults to "now".
   * @param error              Optional: An error to attach to the log.
   */
  writeLogForFlowNode(
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
  ): Promise<void>;

  /**
   * Places all logs for the given ProcessModel into the "archive" folder.
   * Essentially, this is pretty much like "deleting" the logs, as they will no longer be available.
   *
   * However, since logs are somewhat sensitive, they will not be deleted, but archived.
   *
   * @param identity       The identity of the requesting user.
   * @param processModelId The ID of the ProcessModel whose logs are to be archived.
   */
  archiveProcessModelLogs(identity: IIdentity, processModelId: string): Promise<void>;
}
