import {EventReceivedCallback, Subscription} from './subscription';

/**
 * Allows an external Service to subscribe to internal events
 * and to publish them.
 */
export interface IEventAggregator {

  /**
   * Creates a new permanent Subscription for the given event.
   *
   * @param   eventName The name of the event to which to susbcribe.
   * @param   callback  The function to call when the event is triggered.
   * @returns           An object that contains all required information about
   *                    the created Subscription.
   */
  subscribe(eventName: string, callback: EventReceivedCallback): Subscription;

  /**
   * Creates a new Subscription for the given event.
   * The Subscription will be deleted, after the first receit of the event.
   *
   * @param   eventName The name of the event to which to susbcribe.
   * @param   callback  The function to call when the event is triggered.
   * @returns           An object that contains all required information about
   *                    the created Subscription.
   */
  subscribeOnce(eventName: string, callback: EventReceivedCallback): Subscription;

  /**
   * Publishes the event with the given Name and the given payload.
   *
   * @param eventName The name of the event to publish.
   * @param payload   Optional: The payload to send with the event.
   */
  publish(eventName: string, payload?: any): void;

  /**
   * Removes the given subscription from the event aggregator.
   *
   * If no matching subscription exists, nothing will happen.
   *
   * @param subscription The subscription to remove.
   */
  unsubscribe(subscription: Subscription): void;
}
