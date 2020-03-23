import {BaseError} from '../base_error';
import {ErrorCodes} from '../error_codes';

export class MultipleChoicesError extends BaseError {

  constructor(message: string) {
    super(ErrorCodes.MultipleChoicesError, message);
  }

}
