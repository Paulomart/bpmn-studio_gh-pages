import * as moment from 'moment';

import {LogEntry, LogLevel, MetricMeasurementPoint} from '@process-engine/logging_api_contracts';

import * as Serializer from '../serializer';

export function parseProcessModelLog(logData: Array<string>): LogEntry {

  const isV1 = logData[0] === 'ProcessModel';
  const isV2 = logData[0] === 'ProcessModel_V2';

  if (isV1) {
    return parseAsV1(logData);
  }
  if (isV2) {
    return parseAsV2(logData);
  }

  return undefined;
}

function parseAsV1(logData: Array<string>): LogEntry {

  const logEntry = new LogEntry();
  logEntry.timeStamp = moment(logData[1]).toDate();
  logEntry.correlationId = logData[2];
  logEntry.processModelId = logData[3];
  logEntry.processInstanceId = logData[4];
  logEntry.logLevel = LogLevel[logData[7]];
  logEntry.message = logData[8];

  return logEntry;
}

function parseAsV2(logData: Array<string>): LogEntry {

  const logEntry = new LogEntry();
  logEntry.timeStamp = moment(logData[1]).toDate();
  logEntry.correlationId = logData[2];
  logEntry.processModelId = logData[3];
  logEntry.processInstanceId = logData[4];
  logEntry.logLevel = LogLevel[logData[7]];
  logEntry.message = logData[8];
  logEntry.measuredAt = <MetricMeasurementPoint> logData[9];

  const serializedError = logData[11]?.trim();

  const deserializedError = serializedError?.length > 1
    ? Serializer.deserialize(serializedError)
    : undefined;

  logEntry.error = deserializedError;

  return logEntry;
}
