import 'mocha';
import * as should from 'should';

import {
  ErrorCodes,
  FoundError,
  MovedError,
  MultipleChoicesError,
  NotModifiedError,
  PermanentRedirectError,
  SeeOtherError,
  TemporaryRedirectError,
  UseProxyError,
} from '../src/index';

describe('redirect_errors', (): void => {
  describe('FoundError', (): void => {
    it(`should return ${ErrorCodes.FoundError}`, (): void => {
      const error = new FoundError('FoundError');
      should(error.code).be.equal(ErrorCodes.FoundError);
    });
  });

  describe('MovedError', (): void => {
    it(`should return ${ErrorCodes.MovedError}`, (): void => {
      const error = new MovedError('MovedError');
      should(error.code).be.equal(ErrorCodes.MovedError);
    });
  });

  describe('MultipleChoicesError', (): void => {
    it(`should return ${ErrorCodes.MultipleChoicesError}`, (): void => {
      const error = new MultipleChoicesError('MultipleChoicesError');
      should(error.code).be.equal(ErrorCodes.MultipleChoicesError);
    });
  });

  describe('NotModifiedError', (): void => {
    it(`should return ${ErrorCodes.NotModifiedError}`, (): void => {
      const error = new NotModifiedError('NotModifiedError');
      should(error.code).be.equal(ErrorCodes.NotModifiedError);
    });
  });

  describe('PermanentRedirectError', (): void => {
    it(`should return ${ErrorCodes.PermanentRedirectError}`, (): void => {
      const error = new PermanentRedirectError('PermanentRedirectError');
      should(error.code).be.equal(ErrorCodes.PermanentRedirectError);
    });
  });

  describe('SeeOtherError', (): void => {
    it(`should return ${ErrorCodes.SeeOtherError}`, (): void => {
      const error = new SeeOtherError('SeeOtherError');
      should(error.code).be.equal(ErrorCodes.SeeOtherError);
    });
  });

  describe('TemporaryRedirectError', (): void => {
    it(`should return ${ErrorCodes.TemporaryRedirectError}`, (): void => {
      const error = new TemporaryRedirectError('TemporaryRedirectError');
      should(error.code).be.equal(ErrorCodes.TemporaryRedirectError);
    });
  });

  describe('UseProxyError', (): void => {
    it(`should return ${ErrorCodes.UseProxyError}`, (): void => {
      const error = new UseProxyError('UseProxyError');
      should(error.code).be.equal(ErrorCodes.UseProxyError);
    });
  });
});
