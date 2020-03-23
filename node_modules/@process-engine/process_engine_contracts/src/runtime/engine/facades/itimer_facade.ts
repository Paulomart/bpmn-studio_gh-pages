import {Subscription} from '@essential-projects/event_aggregator_contracts';

import {FlowNode, TimerEventDefinition} from '../../../model_duplications/index';

import {IProcessTokenFacade} from './iprocess_token_facade';

/**
 * Handles the creation and resolution of timers.
 */
export interface ITimerFacade {

  /**
   * Initializes a new timer for the given FlowNode, using the given type and
   * value as a baseline.
   *
   * @param   flowNode           The FlowNode to which to attach the timer.
   * @param   timerDefinition    The definition containing the timer.
   * @param   processTokenFacade The facade containing the current ProcessToken.
   * @param   callback           The function to call, after the timer has elapsed.
   * @returns                    A Subscription on the event aggreator,
   *                             which can be used to wait for the timer to elapse.
   */
  initializeTimer(
    flowNode: FlowNode,
    timerDefinition: TimerEventDefinition,
    processTokenFacade: IProcessTokenFacade,
    callback: Function,
  ): Subscription;

  /**
   * Initializes a new cyclic timer, using the given value and FlowNode.
   * When the timer expires, the given callback will be called.
   *
   * @param   crontab               The crontab to use.
   * @param   flowNode              The FlowNode that contains the timer.
   * @param   callback              The callback to call, when the timer expires.
   * @param   timerExpiredEventName Optional: A name for the event to raise, when the timer expires.
   * @returns                       The Subscription that was created on the EventAggregator.
   */
  startCycleTimer(crontab: string, flowNode: FlowNode, callback: Function, timerExpiredEventName?: string): Subscription;

  /**
   * Initializes a new date timer, using the given value.
   * When the timer expires, the given callback will be called.
   *
   * @param   date                  The date at which the timer will be triggered.
   * @param   callback              The callback to call, when the timer expires.
   * @param   timerExpiredEventName Optional: A name for the event to raise, when the timer expires.
   * @returns                       The Subscription that was created on the EventAggregator.
   */
  startDateTimer(date: string, callback: Function, timerExpiredEventName?: string): Subscription;

  /**
   * Initializes a new duration timer, using the given value.
   * When the timer expires, the given callback will be called.
   *
   * @param   duration              The duration to use.
   * @param   callback              The callback to call, when the timer expires.
   * @param   timerExpiredEventName Optional: A name for the event to raise, when the timer expires.
   * @returns                       The Subscription that was created on the EventAggregator.
   */
  startDurationTimer(duration: string, callback: Function, timerExpiredEventName?: string): Subscription;

  /**
   * Validates the given TimerType and TimerValue, using the given FlowNode as a baseline.
   *
   * @param timerDefinition The definition of the timer to validate.
   * @param flowNode        The FlowNode to use as a baseline.
   */
  validateTimer(timerDefinition: TimerEventDefinition, flowNode: FlowNode): void;

  /**
   * Takes a timer expression and a ProcessTokenFacade and checks if the timerExpression contains
   * references to the ProcessToken (i.e. token.history.FlowNode1.abc and the like).
   * If so, these references will be resolved with values from the current ProcessToken,
   * contained within the facade.
   *
   * @param   timerExpression    The timer expression to parse.
   * @param   processTokenFacade The facade containing the current ProcessToken.
   * @returns                    The parsed timer expression.
   */
  executeTimerExpressionIfNeeded(timerExpression: string, processTokenFacade: IProcessTokenFacade): string;

  /**
   * Cancels the given timer subscription.
   *
   * @param subscription The subscription to cancel.
   */
  cancelTimerSubscription(subscription: Subscription): void;
}
