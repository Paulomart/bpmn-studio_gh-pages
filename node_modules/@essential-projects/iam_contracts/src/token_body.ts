/**
 * Contains the most commonly used properties for an identities token payload.
 *
 * The property names are based on the IdentityServer's token schema.
 */
export class TokenBody {

  /**
   * The users unique ID.
   */
  public sub: string;
  /**
   * The users name.
   */
  public name?: string;
  /**
   * A numerical that indicates the tokens lifetime.
   */
  public iat?: number;

}
