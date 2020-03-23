const ApplicationInfoEndpoint = require('./dist/commonjs/index').Endpoints.ApplicationInfo;
const EmptyActivityEndpoint = require('./dist/commonjs/index').Endpoints.EmptyActivity;
const EventEndpoint = require('./dist/commonjs/index').Endpoints.Event;
const ExternalTaskEndpoint = require('./dist/commonjs/index').Endpoints.ExternalTask;
const ManualTaskEndpoint = require('./dist/commonjs/index').Endpoints.ManualTask;
const NotificationEndpoint = require('./dist/commonjs/index').Endpoints.Notification;
const ProcessModelEndpoint = require('./dist/commonjs/index').Endpoints.ProcessModel;
const SwaggerEndpoint = require('./dist/commonjs/index').Endpoints.Swagger;
const UserTaskEndpoint = require('./dist/commonjs/index').Endpoints.UserTask;
const FlowNodeInstanceEndpoint = require('./dist/commonjs/index').Endpoints.FlowNodeInstance;

const routerDiscoveryTag = require('@essential-projects/bootstrapper_contracts').routerDiscoveryTag;
const socketEndpointDiscoveryTag = require('@essential-projects/bootstrapper_contracts').socketEndpointDiscoveryTag;

function registerInContainer(container) {
  registerHttpEndpoints(container);
  registerSocketEndpoints(container);
  registerDeprecatedEndpoints(container);
}

function registerHttpEndpoints(container) {

  container.register('ConsumerApiApplicationInfoRouter', ApplicationInfoEndpoint.ApplicationInfoRouter)
    .dependencies('ConsumerApiApplicationInfoController')
    .singleton()
    .tags(routerDiscoveryTag);

  container.register('ConsumerApiApplicationInfoController', ApplicationInfoEndpoint.ApplicationInfoController)
    .dependencies('ConsumerApiApplicationInfoService')
    .singleton();

  container.register('ConsumerApiEmptyActivityRouter', EmptyActivityEndpoint.EmptyActivityRouter)
    .dependencies('ConsumerApiEmptyActivityController', 'IdentityService')
    .singleton()
    .tags(routerDiscoveryTag);

  container.register('ConsumerApiEmptyActivityController', EmptyActivityEndpoint.EmptyActivityController)
    .dependencies('ConsumerApiEmptyActivityService')
    .singleton();

  container.register('ConsumerApiEventRouter', EventEndpoint.EventRouter)
    .dependencies('ConsumerApiEventController', 'IdentityService')
    .singleton()
    .tags(routerDiscoveryTag);

  container.register('ConsumerApiEventController', EventEndpoint.EventController)
    .dependencies('ConsumerApiEventService')
    .singleton();

  container.register('ConsumerApiExternalTaskRouter', ExternalTaskEndpoint.ExternalTaskRouter)
    .dependencies('ConsumerApiExternalTaskController', 'IdentityService')
    .singleton()
    .tags(routerDiscoveryTag);

  container.register('ConsumerApiExternalTaskController', ExternalTaskEndpoint.ExternalTaskController)
    .dependencies('ConsumerApiExternalTaskService')
    .singleton();

  container.register('ConsumerApiManualTaskRouter', ManualTaskEndpoint.ManualTaskRouter)
    .dependencies('ConsumerApiManualTaskController', 'IdentityService')
    .singleton()
    .tags(routerDiscoveryTag);

  container.register('ConsumerApiManualTaskController', ManualTaskEndpoint.ManualTaskController)
    .dependencies('ConsumerApiManualTaskService')
    .singleton();

  container.register('ConsumerApiProcessModelRouter', ProcessModelEndpoint.ProcessModelRouter)
    .dependencies('ConsumerApiProcessModelController', 'IdentityService')
    .singleton()
    .tags(routerDiscoveryTag);

  container.register('ConsumerApiProcessModelController', ProcessModelEndpoint.ProcessModelController)
    .dependencies('ConsumerApiProcessModelService')
    .singleton();

  container.register('ConsumerApiSwaggerRouter', SwaggerEndpoint.SwaggerRouter)
    .dependencies('ConsumerApiSwaggerController')
    .singleton()
    .tags(routerDiscoveryTag);

  container.register('ConsumerApiSwaggerController', SwaggerEndpoint.SwaggerController)
    .dependencies()
    .singleton();

  container.register('ConsumerApiUserTaskRouter', UserTaskEndpoint.UserTaskRouter)
    .dependencies('ConsumerApiUserTaskController', 'IdentityService')
    .singleton()
    .tags(routerDiscoveryTag);

  container.register('ConsumerApiUserTaskController', UserTaskEndpoint.UserTaskController)
    .dependencies('ConsumerApiUserTaskService')
    .singleton();

  container.register('ConsumerApiFlowNodeInstanceRouter', FlowNodeInstanceEndpoint.FlowNodeInstanceRouter)
    .dependencies('ConsumerApiFlowNodeInstanceController', 'IdentityService')
    .singleton()
    .tags(routerDiscoveryTag);

  container.register('ConsumerApiFlowNodeInstanceController', FlowNodeInstanceEndpoint.FlowNodeInstanceController)
    .dependencies('ConsumerApiFlowNodeInstanceService')
    .singleton();

}

function registerSocketEndpoints(container) {

  container.register('ConsumerApiNotificationSocketEndpoint', NotificationEndpoint.NotificationSocketEndpoint)
    .dependencies('EventAggregator', 'IdentityService', 'ConsumerApiNotificationService')
    .singleton()
    .tags(socketEndpointDiscoveryTag);
}

function registerDeprecatedEndpoints(container) {

  container.register('ConsumerApiExternalTaskRouterDeprecated', ExternalTaskEndpoint.ExternalTaskRouterDeprecated)
    .dependencies('ConsumerApiExternalTaskController', 'IdentityService')
    .singleton()
    .tags(routerDiscoveryTag);
}

module.exports.registerInContainer = registerInContainer;
