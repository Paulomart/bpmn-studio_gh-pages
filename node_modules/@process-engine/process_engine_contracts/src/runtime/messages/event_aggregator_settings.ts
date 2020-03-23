// tslint:disable:typedef
const messageParams = {
  correlationId: ':correlation_id',
  endEventId: ':end_event_id',
  flowNodeInstanceId: ':flow_node_instance_id',
  messageReference: ':message_ref',
  processInstanceId: ':process_instance_id',
  processModelId: ':process_model_id',
  userTaskId: ':user_task_id',
  manualTaskId: ':manual_task_id',
  emptyActivityId: ':empty_activity_id',
  signalReference: ':signal_ref',
};

const messagePaths = {
  // Generic messages
  boundaryEventTriggered: 'boundary_event_triggered',
  activityReached: 'activity_reached',
  activityFinished: 'activity_finished',
  intermediateThrowEventTriggered: 'intermediate_throw_event_triggered',
  intermediateCatchEventReached: 'intermediate_catch_event_reached',
  intermediateCatchEventFinished: 'intermediate_catch_event_finished',
  emptyActivityReached: 'empty_activity_reached',
  emptyActivityFinished: 'empty_activity_finished',
  manualTaskReached: 'manual_task_reached',
  manualTaskFinished: 'manual_task_finished',
  messageTriggered: 'message_triggered',
  processEnded: 'process_ended',
  processStarted: 'process_started',
  processError: 'process_error',
  processTerminated: 'process_terminated',
  signalTriggered: 'signal_triggered',
  userTaskReached: 'user_task_reached',
  userTaskFinished: 'user_task_finished',
  cronjobCreated: 'cronjob_created',
  cronjobExecuted: 'cronjob_executed',
  cronjobStopped: 'cronjob_stopped',
  cronjobUpdated: 'cronjob_updated',
  cronjobRemoved: 'cronjob_removed',

  // Instance specific messages
  finishEmptyActivity:
    `/processengine/correlation/${messageParams.correlationId}/processinstance/` +
    `${messageParams.processInstanceId}/emptyactivity/${messageParams.flowNodeInstanceId}/finish`,
  emptyActivityWithInstanceIdFinished:
    `/processengine/correlation/${messageParams.correlationId}/processinstance/` +
    `${messageParams.processInstanceId}/emptyactivity/${messageParams.flowNodeInstanceId}/finished`,
  finishUserTask:
    `/processengine/correlation/${messageParams.correlationId}/processinstance/` +
    `${messageParams.processInstanceId}/usertask/${messageParams.flowNodeInstanceId}/finish`,
  userTaskWithInstanceIdFinished:
    `/processengine/correlation/${messageParams.correlationId}/processinstance/` +
    `${messageParams.processInstanceId}/usertask/${messageParams.flowNodeInstanceId}/finished`,
  finishManualTask:
    `/processengine/correlation/${messageParams.correlationId}/processinstance/` +
    `${messageParams.processInstanceId}/manualtask/${messageParams.flowNodeInstanceId}/finish`,
  manualTaskWithInstanceIdFinished:
    `/processengine/correlation/${messageParams.correlationId}/processinstance/` +
    `${messageParams.processInstanceId}/manualtask/${messageParams.flowNodeInstanceId}/finished`,
  endEventReached: `/processengine/correlation/${messageParams.correlationId}/processmodel/${messageParams.processModelId}/ended`,
  messageEventReached: `/processengine/process/message/${messageParams.messageReference}`,
  sendTaskReached: `/processengine/process/sendtask/${messageParams.messageReference}`,
  receiveTaskReached: `/processengine/process/receivetask/${messageParams.messageReference}`,
  signalEventReached: `/processengine/process/signal/${messageParams.signalReference}`,
  processInstanceWithIdStarted: `/processengine/process_started/${messageParams.processModelId}`,
  processInstanceWithIdEnded: `/processengine/process/${messageParams.processInstanceId}/ended`,
  processInstanceWithIdErrored: `/processengine/process/${messageParams.processInstanceId}/error`,
  processInstanceWithIdTerminated: `/processengine/process/${messageParams.processInstanceId}/terminated`,
};

export const eventAggregatorSettings = {
  messageParams: messageParams,
  messagePaths: messagePaths,
};
