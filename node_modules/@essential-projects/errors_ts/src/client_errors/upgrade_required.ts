import {BaseError} from '../base_error';
import {ErrorCodes} from '../error_codes';

export class UpgradeRequiredError extends BaseError {

  constructor(message: string) {
    super(ErrorCodes.UpgradeRequiredError, message);
  }

}
