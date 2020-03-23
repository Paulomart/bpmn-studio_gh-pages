import {BaseError} from '../base_error';
import {ErrorCodes} from '../error_codes';

export class ExpectationFailedError extends BaseError {

  constructor(message: string) {
    super(ErrorCodes.ExpectationFailedError, message);
  }

}
