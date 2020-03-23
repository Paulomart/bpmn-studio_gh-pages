import {NextFunction, Response} from 'express';
import {Logger} from 'loggerhythm';

import {BadRequestError, UnauthorizedError} from '@essential-projects/errors_ts';
import {IIdentityService} from '@essential-projects/iam_contracts';
import {HttpRequestWithIdentity} from './http_request_with_identity';

const logger = Logger.createLogger('processengine:consumer_api:resolve_identity_middleware');

export type MiddlewareFunction = (request: HttpRequestWithIdentity, response: Response, next: NextFunction) => Promise<void>;

export function createResolveIdentityMiddleware(identityService: IIdentityService): MiddlewareFunction {

  return async (request: HttpRequestWithIdentity, response: Response, next: NextFunction): Promise<void> => {
    const bearerToken = request.get('authorization');

    if (request.url === '/swagger') {
      return next();
    }

    if (!bearerToken) {
      throw new UnauthorizedError('No auth token provided!');
    }

    // Multiple authorization header values are not supported. So throw an error, if this happens.
    // Background: https://github.com/process-engine/process_engine_runtime/issues/396
    const splitHeaderValues = bearerToken.split(',');
    if (splitHeaderValues.length > 1) {
      logger.error('Detected multiple values for the authorization header!', splitHeaderValues);
      throw new BadRequestError('Detected multiple values for the authorization header!');
    }

    const authToken = bearerToken.substr('Bearer '.length);

    const resolvedIdentity = await identityService.getIdentity(authToken);

    request.identity = resolvedIdentity;

    return next();
  };
}
