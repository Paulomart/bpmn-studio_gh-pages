/**
 * Determines when the ProcessEngine will resolve after a new ProcessInstance was started.
 */
export enum StartCallbackType {
  /**
     * The ProcessEngine will resolve immediately after the ProcessInstance was started.
     */
  CallbackOnProcessInstanceCreated = 1,
  /**
     * The ProcessEngine will resolve after the first EndEvent was reached.
     */
  CallbackOnProcessInstanceFinished = 2,
  /**
     * The ProcessEngine will resolve after a specific EndEvent was reached.
     */
  CallbackOnEndEventReached = 3,
}
