const {
  CorrelationService,
  CronjobService,
  EmptyActivityService,
  EventService,
  FlowNodeInstanceService,
  KpiService,
  LoggingService,
  ManualTaskService,
  NotificationAdapter,
  NotificationService,
  ProcessModelService,
  TokenHistoryService,
  UserTaskService,
} = require('./dist/commonjs/index');

function registerInContainer(container) {

  container
    .register('ManagementApiNotificationAdapter', NotificationAdapter)
    .dependencies('EventAggregator')
    .singleton();

  container
    .register('ManagementApiCorrelationService', CorrelationService)
    .dependencies('CorrelationService')
    .singleton();

  container
    .register('ManagementApiCronjobService', CronjobService)
    .dependencies('CronjobService', 'CronjobHistoryService', 'IamService', 'ManagementApiNotificationAdapter')
    .singleton();

  container
    .register('ManagementApiEmptyActivityService', EmptyActivityService)
    .dependencies(
      'EventAggregator',
      'FlowNodeInstanceService',
      'IamService',
      'ManagementApiNotificationAdapter',
    )
    .singleton();

  container
    .register('ManagementApiEventService', EventService)
    .dependencies(
      'CorrelationService',
      'EventAggregator',
      'FlowNodeInstanceService',
      'IdentityService',
      'IamService',
      'ProcessModelFacadeFactory',
      'ProcessModelUseCases',
    )
    .singleton();

  container
    .register('ManagementApiFlowNodeInstanceService', FlowNodeInstanceService)
    .dependencies(
      'FlowNodeInstanceService',
      'ManagementApiEmptyActivityService',
      'ManagementApiManualTaskService',
      'ManagementApiUserTaskService',
    )
    .singleton();

  container
    .register('ManagementApiKpiService', KpiService)
    .dependencies('FlowNodeInstanceRepository', 'IamService', 'LoggingApiService')
    .singleton();

  container
    .register('ManagementApiLoggingService', LoggingService)
    .dependencies('LoggingApiService')
    .singleton();

  container
    .register('ManagementApiManualTaskService', ManualTaskService)
    .dependencies(
      'EventAggregator',
      'FlowNodeInstanceService',
      'IamService',
      'ManagementApiNotificationAdapter',
    )
    .singleton();

  container
    .register('ManagementApiNotificationService', NotificationService)
    .dependencies('IamService', 'ManagementApiNotificationAdapter')
    .singleton();

  container
    .register('ManagementApiProcessModelService', ProcessModelService)
    .dependencies(
      'CorrelationService',
      'CronjobService',
      'EventAggregator',
      'ExecuteProcessService',
      'IamService',
      'ManagementApiNotificationAdapter',
      'ProcessModelFacadeFactory',
      'ProcessModelUseCases',
    )
    .singleton();

  container
    .register('ManagementApiTokenHistoryService', TokenHistoryService)
    .dependencies('IamService', 'FlowNodeInstanceRepository')
    .singleton();

  container
    .register('ManagementApiUserTaskService', UserTaskService)
    .dependencies(
      'CorrelationService',
      'EventAggregator',
      'FlowNodeInstanceService',
      'IdentityService',
      'IamService',
      'ManagementApiNotificationAdapter',
      'ProcessModelFacadeFactory',
      'ProcessModelUseCases',
      'ProcessTokenFacadeFactory',
    )
    .singleton();
}

module.exports.registerInContainer = registerInContainer;
