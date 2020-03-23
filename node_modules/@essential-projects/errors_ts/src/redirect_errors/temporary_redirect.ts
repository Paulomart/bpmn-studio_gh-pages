import {BaseError} from '../base_error';
import {ErrorCodes} from '../error_codes';

export class TemporaryRedirectError extends BaseError {

  constructor(message: string) {
    super(ErrorCodes.TemporaryRedirectError, message);
  }

}
