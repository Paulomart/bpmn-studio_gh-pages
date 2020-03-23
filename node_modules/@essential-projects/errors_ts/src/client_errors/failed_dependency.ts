import {BaseError} from '../base_error';
import {ErrorCodes} from '../error_codes';

export class FailedDependencyError extends BaseError {

  constructor(message: string) {
    super(ErrorCodes.FailedDependencyError, message);
  }

}
