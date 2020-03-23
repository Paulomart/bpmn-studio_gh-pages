import {BaseError} from '../base_error';
import {ErrorCodes} from '../error_codes';

export class SwitchingProtocolsError extends BaseError {

  constructor(message: string) {
    super(ErrorCodes.SwitchingProtocolsError, message);
  }

}
