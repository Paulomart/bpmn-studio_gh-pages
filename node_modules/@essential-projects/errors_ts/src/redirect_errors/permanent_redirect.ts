import {BaseError} from '../base_error';
import {ErrorCodes} from '../error_codes';

export class PermanentRedirectError extends BaseError {

  constructor(message: string) {
    super(ErrorCodes.PermanentRedirectError, message);
  }

}
