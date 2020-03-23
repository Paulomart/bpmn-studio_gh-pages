import {BaseError} from '../base_error';
import {ErrorCodes} from '../error_codes';

export class FoundError extends BaseError {

  constructor(message: string) {
    super(ErrorCodes.FoundError, message);
  }

}
