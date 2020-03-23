/**
 * Contains definitions for all currently supported types of process tokens.
 *
 * The type of token determines the point in time at which the token was
 * recorded.
 */
export enum ProcessTokenType {
  /**
   * The token that was passed to the FlowNodeInstance when it started execution.
   */
  onEnter = 'onEnter',
  /**
   * The token the FlowNodeInstance had when it finished execution.
   */
  onExit = 'onExit',
  /**
   * The token the FlowNodeInstance had when it was suspended.
   */
  onSuspend = 'onSuspend',
  /**
   * The token the FlowNodeInstance had when it was resumed.
   * These type of tokens will only ever exist, if a corresponding
   * onSuspend type token was created first.
   */
  onResume = 'onResume',
}
