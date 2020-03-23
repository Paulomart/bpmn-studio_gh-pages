import 'mocha';
import * as should from 'should';

import {
  BadGatewayError,
  BandwithLimitExceededError,
  ErrorCodes,
  GatewayTimeoutError,
  InsufficientStorageError,
  InternalServerError,
  LoopDetectedError,
  NetworkAuthenticationRequiredError,
  NotImplementedError,
  ServiceUnavaliableError,
  VersionNotSupportedError,
} from '../src/index';

describe('server_errors', (): void => {
  describe('BadGatewayError', (): void => {
    it(`should return ${ErrorCodes.BadGatewayError}`, (): void => {
      const error = new BadGatewayError('BadGatewayError');
      should(error.code).be.equal(ErrorCodes.BadGatewayError);
    });
  });

  describe('BandwithLimitExceededError', (): void => {
    it(`should return ${ErrorCodes.BandwithLimitExceededError}`, (): void => {
      const error = new BandwithLimitExceededError('BandwithLimitExceededError');
      should(error.code).be.equal(ErrorCodes.BandwithLimitExceededError);
    });
  });

  describe('GatewayTimeoutError', (): void => {
    it(`should return ${ErrorCodes.GatewayTimeoutError}`, (): void => {
      const error = new GatewayTimeoutError('GatewayTimeoutError');
      should(error.code).be.equal(ErrorCodes.GatewayTimeoutError);
    });
  });

  describe('InsufficientStorageError', (): void => {
    it(`should return ${ErrorCodes.InsufficientStorageError}`, (): void => {
      const error = new InsufficientStorageError('InsufficientStorageError');
      should(error.code).be.equal(ErrorCodes.InsufficientStorageError);
    });
  });

  describe('InternalServerError', (): void => {
    it(`should return ${ErrorCodes.InternalServerError}`, (): void => {
      const error = new InternalServerError('InternalServerError');
      should(error.code).be.equal(ErrorCodes.InternalServerError);
    });
  });

  describe('LoopDetectedError', (): void => {
    it(`should return ${ErrorCodes.LoopDetectedError}`, (): void => {
      const error = new LoopDetectedError('LoopDetectedError');
      should(error.code).be.equal(ErrorCodes.LoopDetectedError);
    });
  });

  describe('NetworkAuthenticationRequiredError', (): void => {
    it(`should return ${ErrorCodes.NetworkAuthenticationRequiredError}`, (): void => {
      const error = new NetworkAuthenticationRequiredError('NetworkAuthenticationRequiredError');
      should(error.code).be.equal(ErrorCodes.NetworkAuthenticationRequiredError);
    });
  });

  describe('NotImplementedError', (): void => {
    it(`should return ${ErrorCodes.NotImplementedError}`, (): void => {
      const error = new NotImplementedError('NotImplementedError');
      should(error.code).be.equal(ErrorCodes.NotImplementedError);
    });
  });

  describe('ServiceUnavaliableError', (): void => {
    it(`should return ${ErrorCodes.ServiceUnavaliableError}`, (): void => {
      const error = new ServiceUnavaliableError('ServiceUnavaliableError');
      should(error.code).be.equal(ErrorCodes.ServiceUnavaliableError);
    });
  });

  describe('VersionNotSupportedError', (): void => {
    it(`should return ${ErrorCodes.VersionNotSupportedError}`, (): void => {
      const error = new VersionNotSupportedError('VersionNotSupportedError');
      should(error.code).be.equal(ErrorCodes.VersionNotSupportedError);
    });
  });
});
