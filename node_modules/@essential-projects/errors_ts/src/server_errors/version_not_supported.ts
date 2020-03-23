import {BaseError} from '../base_error';
import {ErrorCodes} from '../error_codes';

export class VersionNotSupportedError extends BaseError {

  constructor(message: string) {
    super(ErrorCodes.VersionNotSupportedError, message);
  }

}
