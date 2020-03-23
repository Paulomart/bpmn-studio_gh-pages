import {LogLevel} from './log_level';
import {MetricMeasurementPoint} from './metric_measurement_point';

/**
 * Describes a single log entry.
 * Contains information about the Correlation, ProcessModel and
 * FlowNodeInstance to which the entry belongs,
 * aswell as a timestamp, LogLevel and the concrete message that was logged.
 *
 * When logging a metric, the message will be something like "onEnter", "onExit", etc.
 *
 * The properties here are ordered in the same manner as they are in the
 * actual log file.
 */
export class LogEntry {

  public timeStamp: Date;
  public correlationId: string;
  public processModelId: string;
  public processInstanceId: string;
  public flowNodeInstanceId?: string;
  public flowNodeId?: string;
  public logLevel: LogLevel;
  public message: string;
  public measuredAt: MetricMeasurementPoint;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public tokenPayload: any;
  public error?: Error;

}
