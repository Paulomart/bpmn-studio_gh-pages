import {BaseError} from '../base_error';
import {ErrorCodes} from '../error_codes';

export class LockedError extends BaseError {

  constructor(message: string) {
    super(ErrorCodes.LockedError, message);
  }

}
