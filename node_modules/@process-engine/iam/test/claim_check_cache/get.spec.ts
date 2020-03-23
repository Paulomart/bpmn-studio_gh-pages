// Note: The tests are accessing private variables, so we must use this type of notation.
/* eslint-disable dot-notation */
import * as should from 'should';

import {ClaimCheckCache} from '../../dist/commonjs/claim_check_cache';

describe('ClaimCheckCache.get()', (): void => {

  let testCache;

  before((): void => {
    const configToUse = {
      enabled: true,
      cleanupIntervalInSeconds: 666,
    };

    testCache = new ClaimCheckCache(configToUse);
  });

  afterEach((): void => {
    testCache['cache'] = {};
  });

  after((): void => {
    testCache.disable();
  });

  it('Should get an existing entry from an enabled cache', (): void => {

    testCache.add('userId', 'claim', true);

    const cachedEntry = testCache.get('userId', 'claim');

    should.exist(cachedEntry);
    should(cachedEntry.userHasClaim).be.true();
  });

  it('Should return undefined, if the cache does not contain a matching entry', (): void => {

    testCache.add('userId', 'claim', true);

    const cachedEntry = testCache.get('userId2', 'claim');

    should.not.exist(cachedEntry);
  });
});
