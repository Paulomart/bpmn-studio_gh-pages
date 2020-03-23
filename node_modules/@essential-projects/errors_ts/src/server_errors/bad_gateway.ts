import {BaseError} from '../base_error';
import {ErrorCodes} from '../error_codes';

export class BadGatewayError extends BaseError {

  constructor(message: string) {
    super(ErrorCodes.BadGatewayError, message);
  }

}
