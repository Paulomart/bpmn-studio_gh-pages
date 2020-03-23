import {BaseError} from '../base_error';
import {ErrorCodes} from '../error_codes';

export class UnavaliableForLegalReasonsError extends BaseError {

  constructor(message: string) {
    super(ErrorCodes.UnavaliableForLegalReasonsError, message);
  }

}
