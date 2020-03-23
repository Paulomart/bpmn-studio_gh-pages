import * as should from 'should';

import {IAMService} from '../../dist/commonjs/iam_service';

import {ClaimCheckCacheMock, HttpClientMock} from '../mocks';

describe('IamService.getFromCache()', (): void => {

  let iamService;

  beforeEach((): void => {
    const claimCheckCacheMock = new ClaimCheckCacheMock({enabled: true});
    const httpClientMock = new HttpClientMock();

    iamService = new IAMService(httpClientMock);
    iamService.cache = claimCheckCacheMock;
  });

  it('Should correctly return the claim check result received from the cache', async (): Promise<void> => {
    const expectedResult = {
      userHasClaim: false,
    };

    const result = await iamService.getFromCache('userId1', 'claim1');
    should(result).be.eql(expectedResult);
  });

  it('Should return undefined, if the cache is disabled', async (): Promise<void> => {
    iamService.cache.config.enabled = false;
    const result = await iamService.getFromCache('userId1', 'claim1');
    should.not.exist(result);
  });

  it('Should return undefined, if the cache does not contain a matching value', async (): Promise<void> => {
    const result = await iamService.getFromCache('userId1', 'claim666');
    should.not.exist(result);
  });

});
