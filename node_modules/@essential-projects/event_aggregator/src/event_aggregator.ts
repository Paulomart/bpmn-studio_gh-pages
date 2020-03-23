import {Logger} from 'loggerhythm';
import * as uuid from 'node-uuid';

import {BadRequestError} from '@essential-projects/errors_ts';
import {EventReceivedCallback, IEventAggregator, Subscription} from '@essential-projects/event_aggregator_contracts';

import {IEventSubscriptionDictionary} from './internal_types';

const logger = Logger.createLogger('essential-projects:event_aggregator');

export class EventAggregator implements IEventAggregator {

  private eventSubscriptionDictionary: IEventSubscriptionDictionary = {};

  public subscribe(eventName: string, callback: EventReceivedCallback): Subscription {
    return this.createSubscription(eventName, callback, false);
  }

  public subscribeOnce(eventName: string, callback: EventReceivedCallback): Subscription {
    return this.createSubscription(eventName, callback, true);
  }

  public publish(eventName: string, payload?: any): void {

    const eventSubscriptions = this.eventSubscriptionDictionary[eventName];

    const noSubscribersForEventExist = !eventSubscriptions || Object.keys(eventSubscriptions).length === 0;
    if (noSubscribersForEventExist) {
      return;
    }

    const subscriptionIds = Object.keys(eventSubscriptions);

    for (const subscribtionId of subscriptionIds) {
      const subscription = eventSubscriptions[subscribtionId];
      invokeEventCallback(eventName, payload, subscription.callback);

      if (subscription.subscribeOnce) {
        delete this.eventSubscriptionDictionary[eventName][subscribtionId];
      }
    }
  }

  public unsubscribe(subscription: Subscription): void {
    if (subscription == undefined || !this.eventSubscriptionDictionary[subscription?.eventName]) {
      return;
    }
    delete this.eventSubscriptionDictionary[subscription.eventName][subscription.id];
  }

  private createSubscription(event: string, callback: EventReceivedCallback, subscribeOnce: boolean): Subscription {

    if (!event) {
      throw new BadRequestError('No event name provided for the subscription!');
    }

    if (!callback) {
      throw new BadRequestError('No callback function provided for the subscription!');
    }

    const subscriptionId = uuid.v4();
    const newSubscription = new Subscription(subscriptionId, event, subscribeOnce);

    const eventIsNotYetRegistered = !this.eventSubscriptionDictionary[event];
    if (eventIsNotYetRegistered) {
      this.eventSubscriptionDictionary[event] = {};
    }

    this.eventSubscriptionDictionary[event][subscriptionId] = {
      subscribeOnce: subscribeOnce,
      callback: callback,
    };

    return newSubscription;
  }

}

/**
 * Triggers the given callback directly with the next process tick.
 * This makes event publishing as instantaneously as it can be with NodeJs.
 *
 * @param eventName    The event name.
 * @param eventPayload The event payload.
 * @param callback     The function to trigger.
 */
function invokeEventCallback(eventName: string, eventPayload: any, callback: Function): void {
  process.nextTick((): void => {
    try {
      callback(eventPayload, eventName);
    } catch (e) {
      logger.error(e);
    }
  });
}
