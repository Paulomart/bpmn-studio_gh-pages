import 'mocha';
import * as should from 'should';

import {
  ContinueError,
  ErrorCodes,
  ProcessingError,
  SwitchingProtocolsError,
} from '../src/index';

describe('information_errors', (): void => {
  describe('ContinueError', (): void => {
    it(`should return ${ErrorCodes.ContinueError}`, (): void => {
      const error = new ContinueError('ContinueError');
      should(error.code).be.equal(ErrorCodes.ContinueError);
    });
  });

  describe('ProcessingError', (): void => {
    it(`should return ${ErrorCodes.ProcessingError}`, (): void => {
      const error = new ProcessingError('ProcessingError');
      should(error.code).be.equal(ErrorCodes.ProcessingError);
    });
  });

  describe('Switching Protocols Error', (): void => {
    it(`should return ${ErrorCodes.SwitchingProtocolsError}`, (): void => {
      const error = new SwitchingProtocolsError('SwitchingProtocolsError');
      should(error.code).be.equal(ErrorCodes.SwitchingProtocolsError);
    });
  });
});
