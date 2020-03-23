import {BaseError} from '../base_error';
import {ErrorCodes} from '../error_codes';

export class InternalServerError extends BaseError {

  constructor(message: string) {
    super(ErrorCodes.InternalServerError, message);
  }

}
