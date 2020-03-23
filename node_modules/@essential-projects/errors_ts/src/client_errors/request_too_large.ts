import {BaseError} from '../base_error';
import {ErrorCodes} from '../error_codes';

export class RequestTooLargeError extends BaseError {

  constructor(message: string) {
    super(ErrorCodes.RequestTooLargeError, message);
  }

}
