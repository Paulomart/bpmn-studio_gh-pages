// Note: The tests are accessing private variables, so we must use this type of notation.
/* eslint-disable dot-notation */
import * as should from 'should';

import {ClaimCheckCache} from '../../dist/commonjs/claim_check_cache';

describe('ClaimCheckCache.add()', (): void => {

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

  it('Should add entries to an enabled cache', (): void => {

    testCache.add('userId', 'claim', true);

    should(testCache.enabled).be.true();
    should.exist(testCache['cache']['userId']);

    should(testCache['cache']['userId']['claim'].userHasClaim).be.true();
  });

  it('Should cache multiple users separately', (): void => {

    testCache.add('userId', 'claim', true);
    testCache.add('userId2', 'claim', false);

    should.exist(testCache['cache']['userId']);
    should.exist(testCache['cache']['userId2']);

    should(testCache['cache']['userId']['claim'].userHasClaim).be.true();
    should(testCache['cache']['userId2']['claim'].userHasClaim).be.false();

    const keysForCache = Object.keys(testCache['cache']);
    should(keysForCache).have.length(2);
  });

  it('Should create entries for each claim for each user', (): void => {

    testCache.add('userId', 'claim', true);
    testCache.add('userId', 'claim2', false);
    testCache.add('userId2', 'claim2', true);

    should.exist(testCache['cache']['userId']);
    should.exist(testCache['cache']['userId2']);

    should(testCache['cache']['userId']['claim'].userHasClaim).be.true();
    should(testCache['cache']['userId']['claim2'].userHasClaim).be.false();
    should(testCache['cache']['userId2']['claim2'].userHasClaim).be.true();

    const keysForCache = Object.keys(testCache['cache']);
    should(keysForCache).have.length(2);

    const claimsForUser = Object.keys(testCache['cache']['userId']);
    should(claimsForUser).have.length(2);
  });

  it('Should update existing claims for users that are already cached', (): void => {

    testCache.add('userId', 'claim', true);
    testCache.add('userId', 'claim', false);

    should.exist(testCache['cache']['userId']);

    should(testCache['cache']['userId']['claim'].userHasClaim).be.false();

    const keysForCache = Object.keys(testCache['cache']);
    should(keysForCache).have.length(1);

    const claimsForUser = Object.keys(testCache['cache']['userId']);
    should(claimsForUser).have.length(1);
  });

  it('Should not add entries to a disabled cache', (): void => {
    const configToUse = {
      enabled: false,
      cleanupIntervalInSeconds: 120000,
    };
    const disabledCache = new ClaimCheckCache(configToUse);

    disabledCache.add('userId', 'claim', true);

    should(disabledCache.enabled).be.false();
    should.not.exist(disabledCache['cache']['userId']);
  });

});
