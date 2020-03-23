import {BaseError} from '../base_error';
import {ErrorCodes} from '../error_codes';

export class MethodNotAllowedError extends BaseError {

  constructor(message: string) {
    super(ErrorCodes.MethodNotAllowedError, message);
  }

}
