import {BaseError} from '../base_error';
import {ErrorCodes} from '../error_codes';

export class RequestTimeoutError extends BaseError {

  constructor(message: string) {
    super(ErrorCodes.RequestTimeoutError, message);
  }

}
