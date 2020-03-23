import {BaseError} from '../base_error';
import {ErrorCodes} from '../error_codes';

export class PaymentRequiredError extends BaseError {

  constructor(message: string) {
    super(ErrorCodes.PaymentRequiredError, message);
  }

}
