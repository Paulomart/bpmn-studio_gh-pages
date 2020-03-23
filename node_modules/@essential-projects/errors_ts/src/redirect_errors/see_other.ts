import {BaseError} from '../base_error';
import {ErrorCodes} from '../error_codes';

export class SeeOtherError extends BaseError {

  constructor(message: string) {
    super(ErrorCodes.SeeOtherError, message);
  }

}
