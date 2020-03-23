import {BaseError} from '../base_error';
import {ErrorCodes} from '../error_codes';

export class NetworkAuthenticationRequiredError extends BaseError {

  constructor(message: string) {
    super(ErrorCodes.NetworkAuthenticationRequiredError, message);
  }

}
