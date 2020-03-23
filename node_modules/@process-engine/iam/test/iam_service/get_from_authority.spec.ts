/* eslint-disable @typescript-eslint/no-explicit-any */
import * as should from 'should';

import {ForbiddenError, InternalServerError, UnauthorizedError} from '@essential-projects/errors_ts';
import {IAMService} from '../../dist/commonjs/iam_service';

import {ClaimCheckCacheMock, HttpClientMock} from '../mocks';

describe('IamService.getFromAuthority()', (): void => {

  let iamService;

  it('Should correctly return the claim check result received from the authority', async (): Promise<void> => {
    const claimCheckCacheMock = new ClaimCheckCacheMock({enabled: true});
    const httpClientMock = new HttpClientMock();

    iamService = new IAMService(httpClientMock);
    iamService.cache = claimCheckCacheMock;
    iamService.config = {
      claimPath: 'abcdefg',
    };

    const result = await iamService.getFromAuthority('userId1', 'claim1');
    should(result).be.true();
  });

  it('Should attach a claim value to the url, if one is provided', async (): Promise<void> => {
    const claimCheckCacheMock = new ClaimCheckCacheMock({enabled: true});
    const httpClientMock = new HttpClientMock();

    httpClientMock.get = async (url: string): Promise<any> => {
      should(url).be.match(/\?claimValue=testClaimValue/i);

      return {
        status: 204,
      };
    };

    iamService = new IAMService(httpClientMock);
    iamService.cache = claimCheckCacheMock;
    iamService.config = {
      claimPath: 'abcdefg',
    };

    const result = await iamService.getFromAuthority('userId1', 'claim1', 'testClaimValue');
    should(result).be.true();
  });

  it('Should interpret a 401 as a negative claim check result', async (): Promise<void> => {
    const claimCheckCacheMock = new ClaimCheckCacheMock({enabled: true});
    const httpClientMock = new HttpClientMock();

    httpClientMock.get = async (url: string): Promise<any> => {
      throw new UnauthorizedError('The user is unauthorized!');
    };

    iamService = new IAMService(httpClientMock);
    iamService.cache = claimCheckCacheMock;
    iamService.config = {
      claimPath: 'abcdefg',
    };

    const result = await iamService.getFromAuthority('userId1', 'claim1');
    should(result).be.false();
  });

  it('Should interpret a 403 as a negative claim check result', async (): Promise<void> => {
    const claimCheckCacheMock = new ClaimCheckCacheMock({enabled: true});
    const httpClientMock = new HttpClientMock();

    httpClientMock.get = async (url: string): Promise<any> => {
      throw new ForbiddenError('The user is forbidden to do this!');
    };

    iamService = new IAMService(httpClientMock);
    iamService.cache = claimCheckCacheMock;
    iamService.config = {
      claimPath: 'abcdefg',
    };

    const result = await iamService.getFromAuthority('userId1', 'claim1');
    should(result).be.false();
  });

  it('Should rethrow other errors, as they indicate an error with the authority itself', async (): Promise<void> => {
    const claimCheckCacheMock = new ClaimCheckCacheMock({enabled: true});
    const httpClientMock = new HttpClientMock();

    httpClientMock.get = async (url: string): Promise<any> => {
      throw new InternalServerError('Something is wrong with the authority!');
    };

    iamService = new IAMService(httpClientMock);
    iamService.cache = claimCheckCacheMock;
    iamService.config = {
      claimPath: 'abcdefg',
    };

    try {
      const result = await iamService.getFromAuthority('userId1', 'claim1');
      should.fail(result, undefined, 'This request should have failed!');
    } catch (error) {
      should(error.message).be.match(/something is wrong with the authority/i);
      should(error.code).be.equal(500);
    }
  });

});
