import {BaseError} from '../base_error';
import {ErrorCodes} from '../error_codes';

export class URLTooLongError extends BaseError {

  constructor(message: string) {
    super(ErrorCodes.URLTooLongError, message);
  }

}
