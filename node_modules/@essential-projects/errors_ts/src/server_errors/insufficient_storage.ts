import {BaseError} from '../base_error';
import {ErrorCodes} from '../error_codes';

export class InsufficientStorageError extends BaseError {

  constructor(message: string) {
    super(ErrorCodes.InsufficientStorageError, message);
  }

}
