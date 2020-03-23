import {BaseError} from '../base_error';
import {ErrorCodes} from '../error_codes';

export class LengthRequiredError extends BaseError {

  constructor(message: string) {
    super(ErrorCodes.LengthRequiredError, message);
  }

}
