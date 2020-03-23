import {BaseError} from '../base_error';
import {ErrorCodes} from '../error_codes';

export class ConflictError extends BaseError {

  constructor(message: string) {
    super(ErrorCodes.ConflictError, message);
  }

}
