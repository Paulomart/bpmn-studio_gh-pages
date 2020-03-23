/**
 * Contains information about an identity.
 */
export interface IIdentity {
  /**
   * The ID of the user to which this identiy belongs.
   */
  userId: string;
  /**
   * The AuthToken associated with this identity.
   */
  token: string;
}
