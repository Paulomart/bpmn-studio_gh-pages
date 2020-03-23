import {BaseError} from '../base_error';
import {ErrorCodes} from '../error_codes';

export class MisdirectedRequestError extends BaseError {

  constructor(message: string) {
    super(ErrorCodes.MisdirectedRequestError, message);
  }

}
