import {BaseError} from '../base_error';
import {ErrorCodes} from '../error_codes';

export class PreconditionFailedError extends BaseError {

  constructor(message: string) {
    super(ErrorCodes.PreconditionFailedError, message);
  }

}
