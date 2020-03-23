import {IConsumerApiClient} from './iconsumer_api_client';

/**
 * This interface wraps the accessor that the ConsumerApiClient will use
 * to connect to an internal or external ProcessEngine.
 * It is derived from IConsumerApiClient, because the accessor will have to
 * perform the same type of requests, regardless of which type of ProcessEngine
 * is used.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IConsumerApiAccessor extends IConsumerApiClient {}
