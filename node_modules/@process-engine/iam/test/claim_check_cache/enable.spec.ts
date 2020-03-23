// Note: The tests are accessing private variables, so we must use this type of notation.
/* eslint-disable dot-notation */
import * as should from 'should';

import {ClaimCheckCache} from '../../dist/commonjs/claim_check_cache';

describe('ClaimCheckCache.enable()', (): void => {

  describe('Startup', (): void => {

    let testCache;

    before((): void => {
      const configToUse = {
        enabled: false,
        cleanupIntervalInSeconds: 1,
      };

      testCache = new ClaimCheckCache(configToUse);
    });

    afterEach((): void => {
      testCache.disable();
    });

    it('Should set the "enabled" flag to "true"', (): void => {
      testCache.enable();
      should(testCache.enabled).be.true();
    });

    it('Should ignore repeated calls, when the cache is already enabled', (): void => {
      testCache.enable();
      testCache.enable();
      testCache.enable();
      testCache.enable();
    });
  });

  describe('Transient cache', (): void => {

    let testCache;

    before((): void => {
      const configToUse = {
        enabled: false,
        cleanupIntervalInSeconds: 1,
      };

      testCache = new ClaimCheckCache(configToUse);
    });

    afterEach((): void => {
      testCache.disable();
    });

    it('Should create and start a timer that periodically calls removeOutdatedEntries', async (): Promise<void> => {

      return new Promise((resolve, reject): void => {
        testCache.removeOutdatedEntries = (): void => {
          should(testCache.enabled).be.true();

          resolve();
        };

        testCache.enable();
      });
    });
  });

  describe('Permanent cache', (): void => {

    it('Should not call removeOutdatedEntries periodically, when cleanup interval is set to 0', async (): Promise<void> => {

      const configToUse = {
        enabled: false,
        cacheLifetimeInSeconds: 1,
        cleanupIntervalInSeconds: 0,
      };

      const testCache = new ClaimCheckCache(configToUse);

      let removeOutdatedEntriesCalled = false;

      testCache.removeOutdatedEntries = (): void => {
        removeOutdatedEntriesCalled = true;
      };

      testCache.enable();

      await new Promise((resolve): void => { setTimeout(resolve, 1100); });

      should(removeOutdatedEntriesCalled).be.false();

      testCache.disable();
    });

    it('Should not call removeOutdatedEntries periodically, when cache value lifetime is set to 0', async (): Promise<void> => {

      const configToUse = {
        enabled: false,
        cacheLifetimeInSeconds: 0,
        cleanupIntervalInSeconds: 1,
      };

      const testCache = new ClaimCheckCache(configToUse);

      let removeOutdatedEntriesCalled = false;

      testCache.removeOutdatedEntries = (): void => {
        removeOutdatedEntriesCalled = true;
      };

      testCache.enable();

      await new Promise((resolve): void => { setTimeout(resolve, 1100); });

      should(removeOutdatedEntriesCalled).be.false();

      testCache.disable();
    });
  });
});
