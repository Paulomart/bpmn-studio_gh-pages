import {BaseError} from '../base_error';
import {ErrorCodes} from '../error_codes';

export class ProcessingError extends BaseError {

  constructor(message: string) {
    super(ErrorCodes.ProcessingError, message);
  }

}
