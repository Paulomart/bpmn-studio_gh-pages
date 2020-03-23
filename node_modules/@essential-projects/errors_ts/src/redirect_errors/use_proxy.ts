import {BaseError} from '../base_error';
import {ErrorCodes} from '../error_codes';

export class UseProxyError extends BaseError {

  constructor(message: string) {
    super(ErrorCodes.UseProxyError, message);
  }

}
