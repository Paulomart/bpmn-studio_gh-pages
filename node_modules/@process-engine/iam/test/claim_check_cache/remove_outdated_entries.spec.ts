// Note: The tests are accessing private variables, so we must use this type of notation.
/* eslint-disable dot-notation */
import * as moment from 'moment';
import * as should from 'should';

import {ClaimCheckCache} from '../../dist/commonjs/claim_check_cache';

describe('ClaimCheckCache.removeOutdatedEntries()', (): void => {

  describe('Transient cache', (): void => {

    let testCache;

    before((): void => {
      const configToUse = {
        enabled: true,
        cacheLifetimeInSeconds: 60,
        cleanupIntervalInSeconds: 666,
      };

      testCache = new ClaimCheckCache(configToUse);
    });

    after((): void => {
      testCache.disable();
    });

    it('Should remove all values from the cache that are past the configured expiration time', (): void => {

      const sampleCache = {
        userId1: {
          claim1: {
            userHasClaim: true,
            lastCheckedAt: moment().add(5, 'seconds'),
          },
          claim2: {
            userHasClaim: false,
            lastCheckedAt: moment().subtract(120, 'seconds'),
          },
        },
        userId2: {
          claim1: {
            userHasClaim: true,
            lastCheckedAt: moment().subtract(55, 'seconds'),
          },
          claim2: {
            userHasClaim: false,
            lastCheckedAt: moment(),
          },
          claim3: {
            userHasClaim: false,
            lastCheckedAt: moment().subtract(61, 'seconds'),
          },
        },
      };

      testCache['cache'] = sampleCache;

      testCache.removeOutdatedEntries();

      should.exist(testCache['cache']['userId1']);
      should.exist(testCache['cache']['userId2']);

      should.exist(testCache['cache']['userId1']['claim1']);
      should.not.exist(testCache['cache']['userId1']['claim2']);

      should.exist(testCache['cache']['userId2']['claim1']);
      should.exist(testCache['cache']['userId2']['claim2']);
      should.not.exist(testCache['cache']['userId2']['claim3']);
    });

  });

  describe('Permanent cache', (): void => {

    let testCache;

    before((): void => {
      const configToUse = {
        enabled: true,
        cacheLifetimeInSeconds: 0,
        cleanupIntervalInSeconds: 1,
      };

      testCache = new ClaimCheckCache(configToUse);
    });

    after((): void => {
      testCache.disable();
    });

    it('Should not remove any values from the cache, when the cache value lifetime is set to 0', (): void => {

      const sampleCache = {
        userId1: {
          claim1: {
            userHasClaim: true,
            lastCheckedAt: moment().add(5, 'seconds'),
          },
          claim2: {
            userHasClaim: false,
            lastCheckedAt: moment().subtract(120, 'seconds'),
          },
        },
        userId2: {
          claim1: {
            userHasClaim: true,
            lastCheckedAt: moment().subtract(55, 'seconds'),
          },
          claim2: {
            userHasClaim: false,
            lastCheckedAt: moment(),
          },
          claim3: {
            userHasClaim: false,
            lastCheckedAt: moment().subtract(61, 'seconds'),
          },
        },
      };

      testCache['cache'] = sampleCache;

      testCache.removeOutdatedEntries();

      should.exist(testCache['cache']['userId1']);
      should.exist(testCache['cache']['userId2']);

      should.exist(testCache['cache']['userId1']['claim1']);
      should.exist(testCache['cache']['userId1']['claim2']);

      should.exist(testCache['cache']['userId2']['claim1']);
      should.exist(testCache['cache']['userId2']['claim2']);
      should.exist(testCache['cache']['userId2']['claim3']);
    });

  });
});
