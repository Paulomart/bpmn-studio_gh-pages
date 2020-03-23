import {Logger} from 'loggerhythm';

import {BadRequestError, ForbiddenError} from '@essential-projects/errors_ts';
import {IHttpClient} from '@essential-projects/http_contracts';
import {IIAMConfiguration, IIAMService, IIdentity} from '@essential-projects/iam_contracts';

import {CacheValue, ClaimCheckCache} from './claim_check_cache';

const logger = Logger.createLogger('processengine:iam:iam_service');

// No logs will be created for any of the claims listed in here.
const optionalclaims = ['can_manage_process_instances'];

export class IAMService implements IIAMService {

  private httpClient: IHttpClient;
  private config: IIAMConfiguration;

  private cache: ClaimCheckCache;

  private httpResponseUnauthorizedCode = 401;
  private httpResponseForbiddenCode = 403;
  private httpResponseOkNoContentCode = 204;

  constructor(httpClient: IHttpClient) {
    this.httpClient = httpClient;
  }

  public async initialize(): Promise<void> {
    const cacheConfigToUse = this.config && this.config.cache
      ? this.config.cache
      : undefined;
    this.cache = new ClaimCheckCache(cacheConfigToUse);

    const isProductionNodeEnv = process.env.NODE_ENV && process.env.NODE_ENV.indexOf('test') === -1;
    const godTokenIsAllowed = this.config && this.config.allowGodToken;
    if (isProductionNodeEnv && godTokenIsAllowed) {
      // eslint-disable-next-line max-len
      logger.error('allowGodToken is set to true. This allows unauthorized access with no restrictions. Never use this setting in a production environment!');
    }
  }

  public async ensureHasClaim(identity: IIdentity, claimName: string, claimValue?: string): Promise<void> {

    if (this.config.disableClaimCheck === true) {
      return;
    }

    if (!identity) {
      throw new BadRequestError('No valid identity given!');
    }

    if (!claimName || claimName === '') {
      throw new BadRequestError('No valid claimName given!');
    }

    const isInternalToken = this.checkIfTokenIsInternalToken(identity.token);
    if (isInternalToken) {
      return;
    }

    const isDummyToken = this.checkIfTokenIsDummyToken(identity.token);
    if (isDummyToken && this.config.allowGodToken === true) {
      return;
    }

    const userHasClaim = await this.checkIfUserHasClaim(identity, claimName, claimValue);

    if (!userHasClaim) {
      const error = new ForbiddenError('Identity does not have the requested claim!');
      error.additionalInformation = {
        identity: identity,
        claim: claimName,
        claimValue: claimValue,
      };

      const isRequiredClaim = !optionalclaims.some((claim) => claim === claimName);
      if (isRequiredClaim) {
        logger.error('Claim check failed!', error);
      }
      throw error;
    }
  }

  private checkIfTokenIsInternalToken(token: string): boolean {
    try {
      return Buffer.from(token, 'base64').toString() === 'ProcessEngineInternalUser';
    } catch (error) {
      return false;
    }
  }

  private checkIfTokenIsDummyToken(token: string): boolean {
    try {
      return Buffer.from(token, 'base64').toString() === 'dummy_token';
    } catch (error) {
      return false;
    }
  }

  private async checkIfUserHasClaim(identity: IIdentity, claimName: string, claimValue?: string): Promise<boolean> {

    const resultFromCache = this.getFromCache(identity.token, claimName);

    if (resultFromCache !== undefined) {
      return resultFromCache.userHasClaim;
    }

    const resultFromAuthority = await this.getFromAuthority(identity.token, claimName, claimValue);

    this.cache.add(identity.token, claimName, resultFromAuthority);

    return resultFromAuthority;
  }

  private getFromCache(token: string, claimName: string): CacheValue {

    if (!this.cache.enabled) {
      return undefined;
    }

    if (!this.cache.hasMatchingEntry(token, claimName)) {
      return undefined;
    }

    return this.cache.get(token, claimName);
  }

  private async getFromAuthority(token: string, claimName: string, claimValue?: string): Promise<boolean> {

    const requestAuthHeaders = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    let url = `${this.config.claimPath}/${claimName}`;

    if (claimValue) {
      url += `?claimValue=${claimValue}`;
    }

    try {
      const response = await this.httpClient.get(url, requestAuthHeaders);

      return response.status === this.httpResponseOkNoContentCode;
    } catch (error) {
      if (error.code === this.httpResponseForbiddenCode || error.code === this.httpResponseUnauthorizedCode) {
        return false;
      }

      logger.error('Failed to send Claim check request against the authority!', error.message, error.stack);
      throw error;
    }
  }

}
