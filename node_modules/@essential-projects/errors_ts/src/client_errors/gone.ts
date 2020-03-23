import {BaseError} from '../base_error';
import {ErrorCodes} from '../error_codes';

export class GoneError extends BaseError {

  constructor(message: string) {
    super(ErrorCodes.GoneError, message);
  }

}
