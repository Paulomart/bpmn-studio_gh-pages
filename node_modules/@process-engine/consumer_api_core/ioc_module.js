const {
  ApplicationInfoService,
  NotificationAdapter,
  EmptyActivityService,
  EventService,
  ExternalTaskService,
  FlowNodeInstanceService,
  ManualTaskService,
  NotificationService,
  ProcessModelService,
  UserTaskService,
} = require('./dist/commonjs/index');

function registerInContainer(container) {

  container
    .register('ConsumerApiApplicationInfoService', ApplicationInfoService)
    .singleton();

  container
    .register('ConsumerApiNotificationAdapter', NotificationAdapter)
    .dependencies('EventAggregator')
    .singleton();

  container
    .register('ConsumerApiEmptyActivityService', EmptyActivityService)
    .dependencies(
      'EventAggregator',
      'FlowNodeInstanceService',
      'IamService',
      'ConsumerApiNotificationAdapter',
    )
    .singleton();

  container
    .register('ConsumerApiEventService', EventService)
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

  container.register('ConsumerApiExternalTaskService', ExternalTaskService)
    .dependencies('EventAggregator', 'ExternalTaskService')
    .singleton();

  container
    .register('ConsumerApiFlowNodeInstanceService', FlowNodeInstanceService)
    .dependencies(
      'FlowNodeInstanceService',
      'ConsumerApiEmptyActivityService',
      'ConsumerApiManualTaskService',
      'ConsumerApiUserTaskService',
    )
    .singleton();

  container
    .register('ConsumerApiManualTaskService', ManualTaskService)
    .dependencies(
      'EventAggregator',
      'FlowNodeInstanceService',
      'IamService',
      'ConsumerApiNotificationAdapter',
    )
    .singleton();

  container
    .register('ConsumerApiNotificationService', NotificationService)
    .dependencies('IamService', 'ConsumerApiNotificationAdapter')
    .singleton();

  container
    .register('ConsumerApiProcessModelService', ProcessModelService)
    .dependencies(
      'ExecuteProcessService',
      'FlowNodeInstanceService',
      'IamService',
      'ConsumerApiNotificationAdapter',
      'ProcessModelFacadeFactory',
      'ProcessModelUseCases',
    )
    .singleton();

  container
    .register('ConsumerApiUserTaskService', UserTaskService)
    .dependencies(
      'CorrelationService',
      'EventAggregator',
      'FlowNodeInstanceService',
      'IdentityService',
      'IamService',
      'ConsumerApiNotificationAdapter',
      'ProcessModelFacadeFactory',
      'ProcessModelUseCases',
      'ProcessTokenFacadeFactory',
    )
    .singleton();
}

module.exports.registerInContainer = registerInContainer;
