/* eslint-disable max-len */
export const messageParams = {
  correlationId: ':correlation_id',
  endEventId: ':end_event_id',
  flowNodeInstanceId: ':flow_node_instance_id',
  userTaskId: ':user_task_id',
  manualTaskId: ':manual_task_id',
  messageReference: ':message_ref',
  processInstanceId: ':process_instance_id',
  processModelId: ':process_model_id',
  signalReference: ':signal_ref',
  emptyActivityId: ':empty_activity_id',
};

export const messagePaths = {
  // Generic messages
  boundaryEventTriggered: 'boundary_event_triggered',
  intermediateThrowEventTriggered: 'intermediate_throw_event_triggered',
  intermediateCatchEventReached: 'intermediate_catch_event_reached',
  intermediateCatchEventFinished: 'intermediate_catch_event_finished',
  activityReached: 'activity_reached',
  activityFinished: 'activity_finished',
  emptyActivityReached: 'empty_activity_reached',
  emptyActivityFinished: 'empty_activity_finished',
  userTaskReached: 'user_task_reached',
  userTaskFinished: 'user_task_finished',
  manualTaskReached: 'manual_task_reached',
  manualTaskFinished: 'manual_task_finished',
  processStarted: 'process_started',
  processEnded: 'process_ended',
  processError: 'process_error',
  processTerminated: 'process_terminated',
  // instance specific messages
  finishEmptyActivity:
    `/processengine/correlation/${messageParams.correlationId}/processinstance/${messageParams.processInstanceId}/emptyactivity/${messageParams.flowNodeInstanceId}/finish`,
  emptyActivityWithInstanceIdFinished:
    `/processengine/correlation/${messageParams.correlationId}/processinstance/${messageParams.processInstanceId}/emptyactivity/${messageParams.flowNodeInstanceId}/finished`,
  finishUserTask:
    `/processengine/correlation/${messageParams.correlationId}/processinstance/${messageParams.processInstanceId}/usertask/${messageParams.flowNodeInstanceId}/finish`,
  userTaskWithInstanceIdFinished:
    `/processengine/correlation/${messageParams.correlationId}/processinstance/${messageParams.processInstanceId}/usertask/${messageParams.flowNodeInstanceId}/finished`,
  finishManualTask:
    `/processengine/correlation/${messageParams.correlationId}/processinstance/${messageParams.processInstanceId}/manualtask/${messageParams.flowNodeInstanceId}/finish`,
  manualTaskWithInstanceIdFinished:
    `/processengine/correlation/${messageParams.correlationId}/processinstance/${messageParams.processInstanceId}/manualtask/${messageParams.flowNodeInstanceId}/finished`,
  endEventReached: `/processengine/correlation/${messageParams.correlationId}/processmodel/${messageParams.processModelId}/ended`,
  messageEventReached: `/processengine/process/message/${messageParams.messageReference}`,
  signalEventReached: `/processengine/process/signal/${messageParams.signalReference}`,
  terminateEndEventReached: `/processengine/process/${messageParams.processInstanceId}/terminated`,
  processInstanceStarted: `/processengine/process_started/${messageParams.processModelId}`,
  processInstanceEnded: `/processengine/process/${messageParams.processInstanceId}/ended`,
};
