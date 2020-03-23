const pathParams = {
  processModelId: 'process_model_id',
  userId: 'user_id',
};

const paths = {
  boundaryEventTriggered: 'boundary_event_triggered',
  callActivityWaiting: 'call_activity_waiting',
  callActivityFinished: 'call_activity_finished',
  emptyActivityWaiting: 'empty_activity_waiting',
  emptyActivityForIdentityWaiting: `empty_activity_waiting/user_id/${pathParams.userId}`,
  emptyActivityFinished: 'empty_activity_finished',
  emptyActivityForIdentityFinished: `empty_activity_finished/user_id/${pathParams.userId}`,
  intermediateThrowEventTriggered: 'intermediate_throw_event_triggered',
  intermediateCatchEventReached: 'intermediate_catch_event_reached',
  intermediateCatchEventFinished: 'intermediate_catch_event_finished',
  userTaskWaiting: 'user_task_waiting',
  userTaskForIdentityWaiting: `user_task_waiting/user_id/${pathParams.userId}`,
  userTaskFinished: 'user_task_finished',
  userTaskForIdentityFinished: `user_task_finished/user_id/${pathParams.userId}`,
  manualTaskWaiting: 'manual_task_waiting',
  manualTaskForIdentityWaiting: `manual_task_waiting/user_id/${pathParams.userId}`,
  manualTaskFinished: 'manual_task_finished',
  manualTaskForIdentityFinished: `manual_task_finished/user_id/${pathParams.userId}`,
  processEnded: 'process_ended',
  processStarted: 'process_started',
  processTerminated: 'process_terminated',
  processInstanceStarted: `/process_instance_started/${pathParams.processModelId}`,
};

const namespace = 'consumer_api';

export const socketSettings = {
  namespace: namespace,
  paths: paths,
  pathParams: pathParams,
};
