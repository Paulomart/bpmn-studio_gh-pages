import {BaseError} from '../base_error';
import {ErrorCodes} from '../error_codes';

export class UnprocessableEntityError extends BaseError {

  constructor(message: string) {
    super(ErrorCodes.UnprocessableEntityError, message);
  }

}
