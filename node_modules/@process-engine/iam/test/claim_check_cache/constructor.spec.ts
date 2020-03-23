// Note: The tests are accessing private variables, so we must use this type of notation.
/* eslint-disable dot-notation */
import * as should from 'should';

import {ClaimCheckCache} from '../../dist/commonjs/claim_check_cache';

describe('ClaimCheckCache - new()', (): void => {

  describe('Use given config', (): void => {

    it('Should not auto-start the cache, when config.enabled == false', (): void => {
      const configToUse = {
        enabled: false,
        cleanupIntervalInSeconds: 120000,
      };
      const cache = new ClaimCheckCache(configToUse);

      should(cache.enabled).be.false();
      should(cache['config']).be.eql(configToUse);
    });

    it('Should not throw an error, when adding entries to a disabled cache', (): void => {
      const configToUse = {
        enabled: false,
        cleanupIntervalInSeconds: 120000,
      };
      const cache = new ClaimCheckCache(configToUse);

      cache.add('userId', 'claim', true);

      should(cache.enabled).be.false();
    });

    it('Should not add entries to a disabled cache', (): void => {
      const configToUse = {
        enabled: false,
        cleanupIntervalInSeconds: 120000,
      };
      const cache = new ClaimCheckCache(configToUse);

      cache.add('userId', 'claim', true);

      should(cache.enabled).be.false();
      should.not.exist(cache['cache']['userId']);
    });

    it('Should auto-start the cache, when config.enabled == true', (): void => {
      const configToUse = {
        enabled: true,
        cleanupIntervalInSeconds: 666,
      };
      const cache = new ClaimCheckCache(configToUse);

      should(cache.enabled).be.true();
      should(cache['config']).be.eql(configToUse);

      cache.disable();
    });

    it('Should add entries to an enabled cache', (): void => {
      const configToUse = {
        enabled: true,
        cleanupIntervalInSeconds: 666,
      };
      const cache = new ClaimCheckCache(configToUse);

      cache.add('userId', 'claim', true);

      should(cache.enabled).be.true();
      should.exist(cache['cache']['userId']);

      should(cache['cache']['userId']['claim'].userHasClaim).be.true();

      cache.disable();
    });
  });

  describe('Use fallback config', (): void => {

    it('Should auto-start the cache', (): void => {
      const cache = new ClaimCheckCache();

      const defaultConfig = {
        enabled: true,
        cacheLifetimeInSeconds: 300,
        cleanupIntervalInSeconds: 10,
      };

      should(cache.enabled).be.true();
      should(cache['config']).be.eql(defaultConfig);

      cache.disable();
    });

    it('Should add entries to an enabled cache', (): void => {

      const cache = new ClaimCheckCache();

      cache.add('userId', 'claim', true);

      should(cache.enabled).be.true();
      should.exist(cache['cache']['userId']);

      should(cache['cache']['userId']['claim'].userHasClaim).be.true();

      cache.disable();
    });
  });

});
