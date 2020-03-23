import {BaseError} from '../base_error';
import {ErrorCodes} from '../error_codes';

export class NotImplementedError extends BaseError {

  constructor(message: string) {
    super(ErrorCodes.NotImplementedError, message);
  }

}
