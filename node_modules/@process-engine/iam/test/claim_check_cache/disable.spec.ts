// Note: The tests are accessing private variables, so we must use this type of notation.
/* eslint-disable dot-notation */
import * as should from 'should';

import {ClaimCheckCache} from '../../dist/commonjs/claim_check_cache';

describe('ClaimCheckCache.disable()', (): void => {

  let testCache;

  before((): void => {
    const configToUse = {
      enabled: false,
      cacheLifetimeInSeconds: 10,
      cleanupIntervalInSeconds: 1,
    };

    testCache = new ClaimCheckCache(configToUse);
  });

  it('Should stop the timer that periodically calls removeOutdatedEntries', async (): Promise<void> => {

    let removeOutdatedEntriesCalled = false;

    testCache.removeOutdatedEntries = (): void => {
      removeOutdatedEntriesCalled = true;
    };

    testCache.enable();
    testCache.disable();

    await new Promise((resolve): void => { setTimeout(resolve, 1100); });

    should(removeOutdatedEntriesCalled).be.false('removeOutdatedEntries was automatically called on a disabled cache!');

  });

  it('Should set the "enabled" flag to "false"', (): void => {
    testCache.enable();
    testCache.disable();
    should(testCache.enabled).be.false();
  });

  it('Should ignore repeated calls, when the cache is already disabled', (): void => {
    testCache.disable();
    testCache.disable();
    testCache.disable();
    testCache.disable();
  });

  it('Should clear the entire cache, when disable is called', (): void => {
    testCache.enable();
    testCache.add('userId', 'claim', true);
    testCache.disable();

    const cachedKeys = Object.keys(testCache['cache']);

    should(cachedKeys).have.length(0);
  });

});
