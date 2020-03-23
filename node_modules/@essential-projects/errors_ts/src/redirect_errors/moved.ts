import {BaseError} from '../base_error';
import {ErrorCodes} from '../error_codes';

export class MovedError extends BaseError {

  constructor(message: string) {
    super(ErrorCodes.MovedError, message);
  }

}
