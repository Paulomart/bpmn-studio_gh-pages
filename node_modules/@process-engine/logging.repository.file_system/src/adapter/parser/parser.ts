import {LogEntry} from '@process-engine/logging_api_contracts';

import {parseFlowNodeInstanceLog} from './flow_node_log_parser';
import {parseProcessModelLog} from './process_model_log_parser';

export function parseLogEntry(logEntryRaw: string): LogEntry {

  const logEntryRawParts = logEntryRaw.split(';');

  const isFlowNodeInstanceLog = logEntryRawParts[0].startsWith('FlowNodeInstance');

  const logEntry = isFlowNodeInstanceLog
    ? parseFlowNodeInstanceLog(logEntryRawParts)
    : parseProcessModelLog(logEntryRawParts);

  return logEntry;
}
