const params = {
  // Id of a Correlation.
  correlationId: ':correlation_id',
  // Instance Id of an EmptyActivity.
  emptyActivityInstanceId: ':empty_activity_instance_id',
  // Id of an EndEvent.
  endEventId: ':end_event_id',
  // Id of an Event.
  eventId: ':event_id',
  // Name of an Event.
  eventName: ':event_name',
  // Id of an ExternalTask.
  externalTaskId: ':external_task_id',
  // Id of a ManualTask.
  manualTaskInstanceId: ':manual_task_instance_id',
  // Instance Id of a Process.
  processInstanceId: ':process_instance_id',
  // Id of a ProcessModel.
  processModelId: ':process_model_id',
  // Id of a StartEvent.
  startEventId: ':start_event_id',
  // Id of a UserTaskInstance.
  userTaskInstanceId: ':user_task_instance_id',
};

const paths = {
  // Application Info

  /*
   * Gets some basic info about the application.
   * @tag AppInfo
   * @method get
   */
  getApplicationInfo: '/info',

  // EmptyActivities

  /*
   * Gets all EmptyActivities for a specific ProcessModel.
   * @tag EmptyActivity
   * @method get
   */
  processModelEmptyActivities: `/process_models/${params.processModelId}/empty_activities`,
  /*
   * Gets all EmptyActivities for a specific ProcessInstance.
   * @tag EmptyActivity
   * @method get
   */
  processInstanceEmptyActivities: `/process_instances/${params.processInstanceId}/empty_activities`,
  /*
   * Gets all EmptyActivities for a specific Correlation.
   * @tag EmptyActivity
   * @method get
   */
  correlationEmptyActivities: `/correlations/${params.correlationId}/empty_activities`,
  /*
   * Gets all EmptyActivities for a specific ProcessModel and Correlation.
   * @tag EmptyActivity
   * @method get
   */
  processModelCorrelationEmptyActivities: `/process_models/${params.processModelId}/correlations/${params.correlationId}/empty_activities`,
  /*
   * Gets all EmptyActivities for the logged in user.
   * @tag EmptyActivity
   * @method get
   */
  getOwnEmptyActivities: '/empty_activities/own',
  /*
   * Finishes a specific EmptyActivity by its ProcessInstanceId, CorrelationId and its EmptyActivityInstanceId.
   * @tag EmptyActivity
   * @method get
   */
  finishEmptyActivity:
    `/processes/${params.processInstanceId}/correlations/${params.correlationId}/empty_activities/${params.emptyActivityInstanceId}/finish`,

  // Events

  /*
   * Gets all Events for a specific ProcessModel.
   * @tag Event
   * @method get
   */
  processModelEvents: `/process_models/${params.processModelId}/events`,
  /*
   * Gets all Events for a specific Correlation.
   * @tag Event
   * @method get
   */
  correlationEvents: `/correlations/${params.correlationId}/events`,
  /*
   * Gets all Events for a specific ProcessModel and Correlation.
   * @tag Event
   * @method get
   */
  processModelCorrelationEvents: `/process_models/${params.processModelId}/correlations/${params.correlationId}/events`,
  /*
   * Triggers a MessageEvent by its name.
   * @tag Event
   * @method post
   */
  triggerMessageEvent: `/message/${params.eventName}/trigger`,
  /*
   * Triggers a SignalEvent by its name.
   * @tag Event
   * @method post
   */
  triggerSignalEvent: `/signal/${params.eventName}/trigger`,

  // ExternalTasks

  /*
   * Fetches the tasks available for an ExternalTaskWorker and locks
   * them for a defined time.
   * @tag ExternalTask
   * @method post
   */
  fetchAndLockExternalTasks: '/fetch_and_lock',
  /*
   * Extends the lock duration of an ExternalTask by a given amount of time.
   * @tag ExternalTask
   * @method post
   */
  extendExternalTaskLock: `/task/${params.externalTaskId}/extend_lock`,
  /*
   * Reports a business error in the context of a running ExternalTask
   * with a specific ID.
   * The error code must be specified to identify the BPMN error handler.
   * @tag ExternalTask
   * @method post
   */
  finishExternalTaskWithBpmnError: `/task/${params.externalTaskId}/handle_bpmn_error`,
  /*
   * Reports a failure to execute an ExternalTask with a specific ID.
   * @tag ExternalTask
   * @method post
   */
  finishExternalTaskWithServiceError: `/task/${params.externalTaskId}/handle_service_error`,
  /*
   * Finishes the ExternalTask with the given ID.
   * @tag ExternalTask
   * @method post
   */
  finishExternalTask: `/task/${params.externalTaskId}/finish`,

  // ManualTask

  /*
   * Gets all ManualTasks for a specific ProcessModel.
   * @tag ManualTask
   * @method get
   */
  processModelManualTasks: `/process_models/${params.processModelId}/manual_tasks`,
  /*
   * Gets all ManualTasks for a specific ProcessInstance.
   * @tag ManualTask
   * @method get
   */
  processInstanceManualTasks: `/process_instances/${params.processInstanceId}/manual_tasks`,
  /*
   * Gets all ManualTasks for a specific Correlation.
   * @tag ManualTask
   * @method get
   */
  correlationManualTasks: `/correlations/${params.correlationId}/manual_tasks`,
  /*
   * Gets all ManualTasks for a specific ProcessModel and Correlation.
   * @tag ManualTask
   * @method get
   */
  processModelCorrelationManualTasks: `/process_models/${params.processModelId}/correlations/${params.correlationId}/manual_tasks`,
  /*
   * Gets all ManualTasks for the logged in user.
   * @tag ManualTask
   * @method get
   */
  getOwnManualTasks: '/manual_tasks/own',
  /*
   * Finishes a specific ManualTask by its ProcessInstanceId, CorrelationId and its ManualTaskInstanceId.
   * @tag ManualTask
   * @method post
   */
  finishManualTask: `/processes/${params.processInstanceId}/correlations/${params.correlationId}/` +
    `manual_tasks/${params.manualTaskInstanceId}/finish`,

  // ProcessModels

  /*
   * Gets all ProcessModels the requesting user is allowed to see.
   * @tag ProcessModel
   * @method get
   */
  processModels: '/process_models',
  /*
   * Gets a ProcessModel by its id.
   * @tag ProcessModel
   * @method get
   */
  processModelById: `/process_models/${params.processModelId}`,
  /*
   * Gets the ProcessModel for a given ProcessInstance.
   * @tag ProcessModel
   * @method get
   */
  processModelByProcessInstanceId: `/process_instance/${params.processInstanceId}/process_model/`,
  /*
   * Starts a new instance for a ProcessModel with the given ID.
   * @tag ProcessModel
   * @method post
   */
  startProcessInstance: `/process_models/${params.processModelId}/start`,
  /*
   * Gets all ProcessInstances for the logged in user.
   * @tag ProcessInstances
   * @method get
   */
  getOwnProcessInstances: '/process_instances/own',
  /*
   * Gets all ProcessResults for a specific ProcessModel and Correlation.
   * @tag ProcessResult
   * @method get
   */
  getProcessResultForCorrelation: `/correlations/${params.correlationId}/process_models/${params.processModelId}/results`,

  // UserTasks

  /*
   * Gets all UserTasks for a specific ProcessModel.
   * @tag UserTask
   * @method get
   */
  processModelUserTasks: `/process_models/${params.processModelId}/user_tasks`,
  /*
   * Gets all UserTasks for a specific ProcessInstance.
   * @tag UserTask
   * @method get
   */
  processInstanceUserTasks: `/process_instances/${params.processInstanceId}/user_tasks`,
  /*
   * Gets all UserTasks for a specific Correlation.
   * @tag UserTask
   * @method get
   */
  correlationUserTasks: `/correlations/${params.correlationId}/user_tasks`,
  /*
   * Gets all UserTasks for a specific ProcessModel and Correlation.
   * @tag UserTask
   * @method get
   */
  processModelCorrelationUserTasks: `/process_models/${params.processModelId}/correlations/${params.correlationId}/user_tasks`,
  /*
   * Gets all UserTasks for the logged in user.
   * @tag UserTask
   * @method get
   */
  getOwnUserTasks: '/user_tasks/own',
  /*
   * Finishes a specific UserTask by its ProcessInstanceId, CorrelationId and its UserTaskInstanceId.
   * @tag UserTask
   * @method post
   */
  finishUserTask: `/processes/${params.processInstanceId}/correlations/${params.correlationId}/usertasks/${params.userTaskInstanceId}/finish`,

  // Task

  /*
   * Gets all suspended Tasks.
   * @tag Task
   * @method get
   */
  allSuspendedTasks: '/suspended_tasks',
  /*
   * Gets all suspended Tasks for a specific ProcessModel.
   * @tag Task
   * @method get
   */
  suspendedProcessModelTasks: `/process_models/${params.processModelId}/tasks`,
  /*
   * Gets all suspended Tasks for a specific ProcessInstance.
   * @tag Task
   * @method get
   */
  suspendedProcessInstanceTasks: `/process_instances/${params.processInstanceId}/tasks`,
  /*
   * Gets all suspended Tasks for a specific Correlation.
   * @tag Task
   * @method get
   */
  suspendedCorrelationTasks: `/correlations/${params.correlationId}/tasks`,
  /*
   * Gets all suspended Tasks for a specific ProcessModel and Correlation.
   * @tag Task
   * @method get
   */
  suspendedProcessModelCorrelationTasks: `/process_models/${params.processModelId}/correlations/${params.correlationId}/tasks`,

};

export const restSettings = {
  params: params,
  paths: paths,
};
