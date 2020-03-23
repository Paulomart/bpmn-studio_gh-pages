import {BaseError} from '../base_error';
import {ErrorCodes} from '../error_codes';

export class BadRequestError extends BaseError {

  constructor(message: string) {
    super(ErrorCodes.BadRequestError, message);
  }

}
