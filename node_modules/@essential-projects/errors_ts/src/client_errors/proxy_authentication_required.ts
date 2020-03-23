import {BaseError} from '../base_error';
import {ErrorCodes} from '../error_codes';

export class ProxyAuthenticationRequiredError extends BaseError {

  constructor(message: string) {
    super(ErrorCodes.ProxyAuthenticationRequiredError, message);
  }

}
