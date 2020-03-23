import {BaseError} from '../base_error';
import {ErrorCodes} from '../error_codes';

export class PreconditionRequiredError extends BaseError {

  constructor(message: string) {
    super(ErrorCodes.PreconditionRequiredError, message);
  }

}
