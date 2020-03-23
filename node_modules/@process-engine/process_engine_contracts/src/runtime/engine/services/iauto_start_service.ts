/**
 * This service is responsible for starting ProcessModels that make use of
 * event based StartEvents.
 *
 * It does this, by subscribing to a global notification for messages and
 * signals.
 * Whenever a signal or message is received, the service will lookup all
 * ProcessModels that use matching StartEvents and create new instances
 * of them.
 */
export interface IAutoStartService {

  /**
   * Starts the Service.
   *
   * @async
   */
  start(): Promise<void>;

  /**
   * Stops the service.
   *
   * @async
   */
  stop(): Promise<void>;
}
