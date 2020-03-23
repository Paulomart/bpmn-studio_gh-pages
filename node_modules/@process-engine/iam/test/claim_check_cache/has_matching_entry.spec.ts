// Note: The tests are accessing private variables, so we must use this type of notation.
/* eslint-disable dot-notation */
import * as should from 'should';

import {ClaimCheckCache} from '../../dist/commonjs/claim_check_cache';

describe('ClaimCheckCache.hasMatchingEntry()', (): void => {

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

  it('Should return true, when the looked up value exists', (): void => {

    testCache.add('userId', 'claim', true);

    const exists = testCache.hasMatchingEntry('userId', 'claim');

    should(exists).be.true();
  });

  it('Should return false, when the looked up value does not exist', (): void => {

    testCache.add('userId', 'claim', true);

    const exists = testCache.hasMatchingEntry('userId2', 'claim');

    should(exists).be.false();
  });
});
