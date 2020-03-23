import {BaseError} from '../base_error';
import {ErrorCodes} from '../error_codes';

export class NotModifiedError extends BaseError {

  constructor(message: string) {
    super(ErrorCodes.NotModifiedError, message);
  }

}
