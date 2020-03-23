// Note: The tests are accessing private variables, so we must use this type of notation.
/* eslint-disable dot-notation */
import * as should from 'should';

import {ClaimCheckCache} from '../../dist/commonjs/claim_check_cache';

describe('ClaimCheckCache.clearEntireCache()', (): void => {

  let testCache;

  before((): void => {
    const configToUse = {
      enabled: true,
      cleanupIntervalInSeconds: 666,
    };

    testCache = new ClaimCheckCache(configToUse);
  });

  after((): void => {
    testCache.disable();
  });

  it('Should clear out all cache entries', (): void => {

    testCache.add('userId', 'claim', true);
    testCache.add('userId', 'claim1', true);
    testCache.add('userId2', 'claim', true);
    testCache.add('userId2', 'claim3', true);
    testCache.add('userId3', 'claim4', true);

    testCache.clearEntireCache();

    const cachedKeys = Object.keys(testCache['cache']);

    should(cachedKeys).have.length(0);
  });

});
