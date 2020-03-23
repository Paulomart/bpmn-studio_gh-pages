import {BaseError} from '../base_error';
import {ErrorCodes} from '../error_codes';

export class ServiceUnavaliableError extends BaseError {

  constructor(message: string) {
    super(ErrorCodes.ServiceUnavaliableError, message);
  }

}
