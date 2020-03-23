import {Request} from 'express';

import {IIdentity} from '@essential-projects/iam_contracts';

/**
 * Extends the base HttpRequest object to include a users identity.
 */
// eslint-disable-next-line @typescript-eslint/interface-name-prefix
export interface HttpRequestWithIdentity extends Request { // TODO: Fix naming
  /**
   * Contains the requesting users identity.
   */
  identity: IIdentity;
}
