import {BaseError} from '../base_error';
import {ErrorCodes} from '../error_codes';

export class ForbiddenError extends BaseError {

  constructor(message: string) {
    super(ErrorCodes.ForbiddenError, message);
  }

}
