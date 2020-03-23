import {EventReceivedCallback} from '@essential-projects/event_aggregator_contracts';

/**
 * Internal interface for grouping all EventSubscriptions by the event to which they have subscribed.
 *
 * Syntax looks like this:
 * {
 *   eventName1: {
 *     subscriptionId1: {
 *       subscribeOnce: true|false,
 *       callback: [Function someFunction],
 *     },
 *     subscriptionId2: {
 *       subscribeOnce: true|false,
 *       callback: [Function someFunction],
 *     },
 *   }
 *   eventName2: {
 *     subscriptionId1: {
 *       subscribeOnce: true|false,
 *       callback: [Function someFunction],
 *     },
 *   }
 * }
 */
export interface IEventSubscriptionDictionary {[eventName: string]: ISubscriberCollection}

/**
 * Internal interface for grouping together multiple subscriptions for a specific event.
 */
export interface ISubscriberCollection {[subscriberId: string]: IInternalSubscription}

/**
 * Internal interface that describes a single subscription.
 */
export interface IInternalSubscription {
  subscribeOnce: boolean;
  callback: EventReceivedCallback;
}
