import {BaseError} from '../base_error';
import {ErrorCodes} from '../error_codes';

export class RequestedRangeNotSatisfiableError extends BaseError {

  constructor(message: string) {
    super(ErrorCodes.RequestedRangeNotSatisfiableError, message);
  }

}
