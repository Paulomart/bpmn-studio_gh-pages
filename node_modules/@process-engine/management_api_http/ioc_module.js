const CorrelationEndpoint = require('./dist/commonjs/index').Endpoints.Correlation;
const CronjobEndpoint = require('./dist/commonjs/index').Endpoints.Cronjob;
const EmptyActivityEndpoint = require('./dist/commonjs/index').Endpoints.EmptyActivity;
const EventEndpoint = require('./dist/commonjs/index').Endpoints.Event;
const FlowNodeInstanceEndpoint = require('./dist/commonjs/index').Endpoints.FlowNodeInstance;
const KpiEndpoint = require('./dist/commonjs/index').Endpoints.Kpi;
const LoggingEndpoint = require('./dist/commonjs/index').Endpoints.Logging;
const ManualTaskEndpoint = require('./dist/commonjs/index').Endpoints.ManualTask;
const NotificationEndpoint = require('./dist/commonjs/index').Endpoints.Notification;
const ProcessModelEndpoint = require('./dist/commonjs/index').Endpoints.ProcessModel;
const TokenHistoryEndpoint = require('./dist/commonjs/index').Endpoints.TokenHistory;
const UserTaskEndpoint = require('./dist/commonjs/index').Endpoints.UserTask;
const SwaggerEndpoint = require('./dist/commonjs/index').Endpoints.Swagger;

const routerDiscoveryTag = require('@essential-projects/bootstrapper_contracts').routerDiscoveryTag;
const socketEndpointDiscoveryTag = require('@essential-projects/bootstrapper_contracts').socketEndpointDiscoveryTag;

function registerInContainer(container) {
  registerHttpEndpoints(container);
  registerSocketEndpoints(container);
}

function registerHttpEndpoints(container) {

  container.register('ManagementApiCorrelationRouter', CorrelationEndpoint.CorrelationRouter)
    .dependencies('ManagementApiCorrelationController', 'IdentityService')
    .singleton()
    .tags(routerDiscoveryTag);

  container.register('ManagementApiCorrelationController', CorrelationEndpoint.CorrelationController)
    .dependencies('ManagementApiCorrelationService')
    .singleton();

  container.register('ManagementApiCronjobRouter', CronjobEndpoint.CronjobRouter)
    .dependencies('ManagementApiCronjobController', 'IdentityService')
    .singleton()
    .tags(routerDiscoveryTag);

  container.register('ManagementApiCronjobController', CronjobEndpoint.CronjobController)
    .dependencies('ManagementApiCronjobService')
    .singleton();

  container.register('ManagementApiEmptyActivityRouter', EmptyActivityEndpoint.EmptyActivityRouter)
    .dependencies('ManagementApiEmptyActivityController', 'IdentityService')
    .singleton()
    .tags(routerDiscoveryTag);

  container.register('ManagementApiEmptyActivityController', EmptyActivityEndpoint.EmptyActivityController)
    .dependencies('ManagementApiEmptyActivityService')
    .singleton();

  container.register('ManagementApiEventRouter', EventEndpoint.EventRouter)
    .dependencies('ManagementApiEventController', 'IdentityService')
    .singleton()
    .tags(routerDiscoveryTag);

  container.register('ManagementApiEventController', EventEndpoint.EventController)
    .dependencies('ManagementApiEventService')
    .singleton();

  container.register('ManagementApiFlowNodeInstanceRouter', FlowNodeInstanceEndpoint.FlowNodeInstanceRouter)
    .dependencies('ManagementApiFlowNodeInstanceController', 'IdentityService')
    .singleton()
    .tags(routerDiscoveryTag);

  container.register('ManagementApiFlowNodeInstanceController', FlowNodeInstanceEndpoint.FlowNodeInstanceController)
    .dependencies('ManagementApiFlowNodeInstanceService')
    .singleton();

  container.register('ManagementApiKpiRouter', KpiEndpoint.KpiRouter)
    .dependencies('ManagementApiKpiController', 'IdentityService')
    .singleton()
    .tags(routerDiscoveryTag);

  container.register('ManagementApiKpiController', KpiEndpoint.KpiController)
    .dependencies('ManagementApiKpiService')
    .singleton();

  container.register('ManagementApiLoggingRouter', LoggingEndpoint.LoggingRouter)
    .dependencies('ManagementApiLoggingController', 'IdentityService')
    .singleton()
    .tags(routerDiscoveryTag);

  container.register('ManagementApiLoggingController', LoggingEndpoint.LoggingController)
    .dependencies('ManagementApiLoggingService')
    .singleton();

  container.register('ManagementApiManualTaskRouter', ManualTaskEndpoint.ManualTaskRouter)
    .dependencies('ManagementApiManualTaskController', 'IdentityService')
    .singleton()
    .tags(routerDiscoveryTag);

  container.register('ManagementApiManualTaskController', ManualTaskEndpoint.ManualTaskController)
    .dependencies('ManagementApiManualTaskService')
    .singleton();

  container.register('ManagementApiProcessModelRouter', ProcessModelEndpoint.ProcessModelRouter)
    .dependencies('ManagementApiProcessModelController', 'IdentityService')
    .singleton()
    .tags(routerDiscoveryTag);

  container.register('ManagementApiProcessModelController', ProcessModelEndpoint.ProcessModelController)
    .dependencies('ManagementApiProcessModelService')
    .singleton();

  container.register('ManagementApiSwaggerRouter', SwaggerEndpoint.SwaggerRouter)
    .dependencies('ManagementApiSwaggerController')
    .singleton()
    .tags(routerDiscoveryTag);

  container.register('ManagementApiSwaggerController', SwaggerEndpoint.SwaggerController)
    .dependencies()
    .singleton();

  container.register('ManagementApiTokenHistoryRouter', TokenHistoryEndpoint.TokenHistoryRouter)
    .dependencies('ManagementApiTokenHistoryController', 'IdentityService')
    .singleton()
    .tags(routerDiscoveryTag);

  container.register('ManagementApiTokenHistoryController', TokenHistoryEndpoint.TokenHistoryController)
    .dependencies('ManagementApiTokenHistoryService')
    .singleton();

  container.register('ManagementApiUserTaskRouter', UserTaskEndpoint.UserTaskRouter)
    .dependencies('ManagementApiUserTaskController', 'IdentityService')
    .singleton()
    .tags(routerDiscoveryTag);

  container.register('ManagementApiUserTaskController', UserTaskEndpoint.UserTaskController)
    .dependencies('ManagementApiUserTaskService')
    .singleton();
}

function registerSocketEndpoints(container) {

  container.register('ManagementApiEmptyActivitySocketEndpoint', EmptyActivityEndpoint.EmptyActivitySocketEndpoint)
    .dependencies('EventAggregator', 'IdentityService', 'ManagementApiNotificationService')
    .singleton()
    .tags(socketEndpointDiscoveryTag);

  container.register('ManagementApiCronjobSocketEndpoint', CronjobEndpoint.CronjobSocketEndpoint)
    .dependencies('EventAggregator', 'IdentityService')
    .singleton()
    .tags(socketEndpointDiscoveryTag);

  container.register('ManagementApiNotificationSocketEndpoint', NotificationEndpoint.NotificationSocketEndpoint)
    .dependencies('EventAggregator', 'IdentityService')
    .singleton()
    .tags(socketEndpointDiscoveryTag);

  container.register('ManagementApiManualTaskSocketEndpoint', ManualTaskEndpoint.ManualTaskSocketEndpoint)
    .dependencies('EventAggregator', 'IdentityService', 'ManagementApiNotificationService')
    .singleton()
    .tags(socketEndpointDiscoveryTag);

  container.register('ManagementApiProcessModelSocketEndpoint', ProcessModelEndpoint.ProcessModelSocketEndpoint)
    .dependencies('EventAggregator', 'IdentityService')
    .singleton()
    .tags(socketEndpointDiscoveryTag);

  container.register('ManagementApiUserTaskSocketEndpoint', UserTaskEndpoint.UserTaskSocketEndpoint)
    .dependencies('EventAggregator', 'IdentityService', 'ManagementApiNotificationService')
    .singleton()
    .tags(socketEndpointDiscoveryTag);
}

module.exports.registerInContainer = registerInContainer;
