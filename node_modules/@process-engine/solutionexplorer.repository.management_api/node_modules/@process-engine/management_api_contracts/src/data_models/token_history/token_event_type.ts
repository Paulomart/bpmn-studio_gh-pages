/**
 * Contains a definition of all possible token types.
 * The token type determines the point of a FNIs lifecycle at which the token was recorded.
 */
export enum TokenEventType {
  onEnter = 'onEnter',
  onExit = 'onExit',
  onSuspend = 'onSuspend',
  onResume = 'onResume',
}
