import {BaseError} from '../base_error';
import {ErrorCodes} from '../error_codes';

export class ImATeapotError extends BaseError {

  constructor(message: string) {
    super(ErrorCodes.ImATeapotError, message);
  }

}
