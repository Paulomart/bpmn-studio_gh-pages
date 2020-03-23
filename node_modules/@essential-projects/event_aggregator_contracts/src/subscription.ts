/**
 * Defines the signature for the Callback that an EventSubscription should have.
 *
 * @param eventPayload Optional: The payload received with the event.
 * @param eventName    Optional: The name of the received event.
 */
export type EventReceivedCallback = (eventPayload?: any, eventName?: string) => void | Promise<void>;

/**
 * Contains information about a subscription on the EventAggregator.
 * External services can use this information to manage their own subscriptions.
 */
export class Subscription {

  /**
   * The Id under which the EventAggregator has stored the Subscription.
   */
  public readonly id: string;
  /**
   * The name of the event for which the Subscription was created.
   */
  public readonly eventName: string;
  /**
   * If set to true, the Subscription will be destroyed after first receiving
   * the event.
   */
  public readonly onlyReceiveOnce: boolean;

  constructor(id: string, eventName: string, onlyReceiveOnce: boolean = false) {
    this.id = id;
    this.eventName = eventName;
    this.onlyReceiveOnce = onlyReceiveOnce;
  }

}
