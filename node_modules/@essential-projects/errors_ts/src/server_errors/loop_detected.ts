import {BaseError} from '../base_error';
import {ErrorCodes} from '../error_codes';

export class LoopDetectedError extends BaseError {

  constructor(message: string) {
    super(ErrorCodes.LoopDetectedError, message);
  }

}
