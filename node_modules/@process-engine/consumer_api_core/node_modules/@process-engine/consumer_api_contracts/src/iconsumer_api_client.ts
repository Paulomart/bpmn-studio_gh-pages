import {APIs} from './apis/index';

/**
 * The client provides endpoints for all UseCases the ConsumerAPI employs.
 */
export interface IConsumerApiClient
  extends APIs.IApplicationInfoConsumerApi,
  APIs.IEmptyActivityConsumerApi,
  APIs.IEventConsumerApi,
  APIs.IExternalTaskConsumerApi,
  APIs.IManualTaskConsumerApi,
  APIs.INotificationConsumerApi,
  APIs.IProcessModelConsumerApi,
  APIs.IUserTaskConsumerApi,
  APIs.IFlowNodeInstanceConsumerApi {}
