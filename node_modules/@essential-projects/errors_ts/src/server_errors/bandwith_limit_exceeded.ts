import {BaseError} from '../base_error';
import {ErrorCodes} from '../error_codes';

export class BandwithLimitExceededError extends BaseError {

  constructor(message: string) {
    super(ErrorCodes.BandwithLimitExceededError, message);
  }

}
