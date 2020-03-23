import * as should from 'should';

import {ClaimCheckCache} from '../../dist/commonjs/claim_check_cache';
import {IAMService} from '../../dist/commonjs/iam_service';

import {HttpClientMock} from '../mocks';

describe('IamService.initialize()', (): void => {

  const httpClientMock = new HttpClientMock();
  const iamServiceConfig = {
    cache: {
      enabled: false,
      cacheLifetimeInSeconds: 10,
      cleanupIntervalInSeconds: 12,
    },
  };

  let iamService;

  beforeEach((): void => {
    iamService = new IAMService(httpClientMock);
  });

  afterEach((): void => {
    iamService.cache.disable();
  });

  it('Should correctly create an instance of the ClaimCheckCache, using the given config', async (): Promise<void> => {
    iamService.config = iamServiceConfig;
    await iamService.initialize();

    should(iamService.cache).be.instanceOf(ClaimCheckCache);
    should(iamService.cache.config).be.eql(iamServiceConfig.cache);
    should(iamService.cache.enabled).be.false();
  });

  it('Should correctly create an instance of the ClaimCheckCache, using the cache\'s default config', async (): Promise<void> => {
    await iamService.initialize();

    const expectedDefaultConfig = {
      enabled: true,
      cacheLifetimeInSeconds: 300,
      cleanupIntervalInSeconds: 10,
    };

    should(iamService.cache).be.instanceOf(ClaimCheckCache);
    should(iamService.cache.config).be.eql(expectedDefaultConfig);
    should(iamService.cache.enabled).be.true();
  });

});
