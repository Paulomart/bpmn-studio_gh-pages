import {BaseError} from '../base_error';
import {ErrorCodes} from '../error_codes';

export class ContinueError extends BaseError {

  constructor(message: string) {
    super(ErrorCodes.ContinueError, message);
  }

}
