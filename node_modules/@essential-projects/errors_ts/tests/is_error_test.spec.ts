import 'mocha';
import * as should from 'should';

import {
  BadGatewayError,
  NotFoundError,
  isError,
  isEssentialProjectsError,
} from '../src/index';

describe('isError()', (): void => {

  describe('Bad Gateway Error true', (): void => {
    it('should return true', (): void => {
      const badGatewayError = new BadGatewayError('test');
      const isBadGatewayError = isError(badGatewayError, BadGatewayError);
      should(isBadGatewayError).be.equal(true);
    });
  });

  describe('Bad Gateway Error false', (): void => {
    it('should return false', (): void => {
      const badGatewayError = new BadGatewayError('test');
      const isNotFoundFoundError = isError(badGatewayError, NotFoundError);
      should(isNotFoundFoundError).be.equal(false);
    });
  });
});

describe('isEssentialsProjectsError()', (): void => {
  describe('IsEssentialProjectsError true', (): void => {
    it('should return true', (): void => {
      const badGatewayError = new BadGatewayError('test');
      const isKnownError = isEssentialProjectsError(badGatewayError);
      should(isKnownError).be.equal(true);
    });
  });

  describe('IsEssentialProjectsError false', (): void => {
    it('should return false', (): void => {
      const isKnownError = isEssentialProjectsError('test');
      should(isKnownError).be.equal(false);
    });
  });
});
