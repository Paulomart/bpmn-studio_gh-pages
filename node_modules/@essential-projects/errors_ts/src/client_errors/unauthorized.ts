import {BaseError} from '../base_error';
import {ErrorCodes} from '../error_codes';

export class UnauthorizedError extends BaseError {

  constructor(message: string) {
    super(ErrorCodes.UnauthorizedError, message);
  }

}
