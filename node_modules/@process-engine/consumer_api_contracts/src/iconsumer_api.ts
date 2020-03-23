import {APIs} from './apis/index';

/**
 * The primary access point for the ConsumerAPI.
 * This service contains all functions that the ConsumerAPI employs to
 * communicate with the ProcessEngine.
 */
export interface IConsumerApi
  extends APIs.IEmptyActivityConsumerApi,
  APIs.IEventConsumerApi,
  APIs.IManualTaskConsumerApi,
  APIs.INotificationConsumerApi,
  APIs.IProcessModelConsumerApi,
  APIs.IUserTaskConsumerApi {}
