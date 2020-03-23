import {BaseError} from '../base_error';
import {ErrorCodes} from '../error_codes';

export class RequestHeaderTooLargeError extends BaseError {

  constructor(message: string) {
    super(ErrorCodes.RequestHeaderTooLargeError, message);
  }

}
