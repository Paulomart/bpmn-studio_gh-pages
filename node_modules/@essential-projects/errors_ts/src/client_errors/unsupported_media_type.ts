import {BaseError} from '../base_error';
import {ErrorCodes} from '../error_codes';

export class UnsupportedMediaTypeError extends BaseError {

  constructor(message: string) {
    super(ErrorCodes.UnsupportedMediaTypeError, message);
  }

}
