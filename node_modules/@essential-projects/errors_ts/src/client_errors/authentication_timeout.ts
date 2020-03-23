import {BaseError} from '../base_error';
import {ErrorCodes} from '../error_codes';

export class AuthenticationTimeoutError extends BaseError {

  constructor(message: string) {
    super(ErrorCodes.AuthenticationTimeoutError, message);
  }

}
