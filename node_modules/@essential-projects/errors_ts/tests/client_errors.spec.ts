import 'mocha';
import * as should from 'should';

import {
  AuthenticationTimeoutError,
  BadRequestError,
  ConflictError,
  ErrorCodes,
  ExpectationFailedError,
  FailedDependencyError,
  ForbiddenError,
  GoneError,
  ImATeapotError,
  LengthRequiredError,
  LockedError,
  MethodNotAllowedError,
  MisdirectedRequestError,
  NotAcceptableError,
  NotFoundError,
  PaymentRequiredError,
  PolicyNotFulfilledError,
  PreconditionFailedError,
  PreconditionRequiredError,
  ProxyAuthenticationRequiredError,
  RequestHeaderTooLargeError,
  RequestTimeoutError,
  RequestTooLargeError,
  RequestedRangeNotSatisfiableError,
  TooManyRequestsError,
  URLTooLongError,
  UnauthorizedError,
  UnavaliableForLegalReasonsError,
  UnprocessableEntityError,
  UnsupportedMediaTypeError,
  UpgradeRequiredError,
} from '../src/index';

describe('client_errors', (): void => {
  describe('AuthenticationFailedError', (): void => {
    it(`should return ${ErrorCodes.AuthenticationTimeoutError}`, (): void => {
      const error = new AuthenticationTimeoutError('AuthenticationTimeoutError');
      should(error.code).be.equal(ErrorCodes.AuthenticationTimeoutError);
    });
  });

  describe('PreconditionFailedError', (): void => {
    it(`should return ${ErrorCodes.PreconditionFailedError}`, (): void => {
      const error = new PreconditionFailedError('PreconditionFailedError');
      should(error.code).be.equal(ErrorCodes.PreconditionFailedError);
    });
  });

  describe('PreconditionRequiredError', (): void => {
    it(`should return ${ErrorCodes.PreconditionRequiredError}`, (): void => {
      const error = new PreconditionRequiredError('PreconditionRequiredError');
      should(error.code).be.equal(ErrorCodes.PreconditionRequiredError);
    });
  });

  describe('ProxyAuthenticationRequiredError', (): void => {
    it(`should return ${ErrorCodes.ProxyAuthenticationRequiredError}`, (): void => {
      const error = new ProxyAuthenticationRequiredError('ProxyAuthenticationRequiredError');
      should(error.code).be.equal(ErrorCodes.ProxyAuthenticationRequiredError);
    });
  });

  describe('RequestHeaderTooLargeError', (): void => {
    it(`should return ${ErrorCodes.RequestHeaderTooLargeError}`, (): void => {
      const error = new RequestHeaderTooLargeError('RequestHeaderTooLargeError');
      should(error.code).be.equal(ErrorCodes.RequestHeaderTooLargeError);
    });
  });

  describe('RequestTimeoutError', (): void => {
    it(`should return ${ErrorCodes.RequestTimeoutError}`, (): void => {
      const error = new RequestTimeoutError('RequestTimeoutError');
      should(error.code).be.equal(ErrorCodes.RequestTimeoutError);
    });
  });

  describe('RequestTooLargeError', (): void => {
    it(`should return ${ErrorCodes.RequestTooLargeError}`, (): void => {
      const error = new RequestTooLargeError('RequestTooLargeError');
      should(error.code).be.equal(ErrorCodes.RequestTooLargeError);
    });
  });

  describe('RequestedRangeNotSatisfiableError', (): void => {
    it(`should return ${ErrorCodes.RequestedRangeNotSatisfiableError}`, (): void => {
      const error = new RequestedRangeNotSatisfiableError('RequestedRangeNotSatisfiableError');
      should(error.code).be.equal(ErrorCodes.RequestedRangeNotSatisfiableError);
    });
  });

  describe('TooManyRequestsError', (): void => {
    it(`should return ${ErrorCodes.TooManyRequestsError}`, (): void => {
      const error = new TooManyRequestsError('TooManyRequestsError');
      should(error.code).be.equal(ErrorCodes.TooManyRequestsError);
    });
  });

  describe('UnauthorizedError', (): void => {
    it(`should return ${ErrorCodes.UnauthorizedError}`, (): void => {
      const error = new UnauthorizedError('UnauthorizedError');
      should(error.code).be.equal(ErrorCodes.UnauthorizedError);
    });
  });

  describe('UnavaliableForLegalReasonsError', (): void => {
    it(`should return ${ErrorCodes.UnavaliableForLegalReasonsError}`, (): void => {
      const error = new UnavaliableForLegalReasonsError('UnavaliableForLegalReasonsError');
      should(error.code).be.equal(ErrorCodes.UnavaliableForLegalReasonsError);
    });
  });

  describe('UnprocessableEntityError', (): void => {
    it(`should return ${ErrorCodes.UnprocessableEntityError}`, (): void => {
      const error = new UnprocessableEntityError('UnprocessableEntityError');
      should(error.code).be.equal(ErrorCodes.UnprocessableEntityError);
    });
  });

  describe('UnsupportedMediaTypeError', (): void => {
    it(`should return ${ErrorCodes.UnsupportedMediaTypeError}`, (): void => {
      const error = new UnsupportedMediaTypeError('UnsupportedMediaTypeError');
      should(error.code).be.equal(ErrorCodes.UnsupportedMediaTypeError);
    });
  });

  describe('UpgradeRequiredError', (): void => {
    it(`should return ${ErrorCodes.UpgradeRequiredError}`, (): void => {
      const error = new UpgradeRequiredError('UpgradeRequiredError');
      should(error.code).be.equal(ErrorCodes.UpgradeRequiredError);
    });
  });

  describe('URLTooLongError', (): void => {
    it(`should return ${ErrorCodes.URLTooLongError}`, (): void => {
      const error = new URLTooLongError('URLTooLongError');
      should(error.code).be.equal(ErrorCodes.URLTooLongError);
    });
  });

  describe('Bad Request Error', (): void => {
    it(`should return ${ErrorCodes.BadRequestError}`, (): void => {
      const error = new BadRequestError('BadRequestError');
      should(error.code).be.equal(ErrorCodes.BadRequestError);
    });
  });

  describe('Conflict Error', (): void => {
    it(`should return ${ErrorCodes.ConflictError}`, (): void => {
      const error = new ConflictError('ConflictError');
      should(error.code).be.equal(ErrorCodes.ConflictError);
    });
  });

  describe('Expectation Failed Error', (): void => {
    it(`should return ${ErrorCodes.ExpectationFailedError}`, (): void => {
      const error = new ExpectationFailedError('ExpectationFailedError');
      should(error.code).be.equal(ErrorCodes.ExpectationFailedError);
    });
  });

  describe('Failed Dependency Error', (): void => {
    it(`should return ${ErrorCodes.FailedDependencyError}`, (): void => {
      const error = new FailedDependencyError('FailedDependencyError');
      should(error.code).be.equal(ErrorCodes.FailedDependencyError);
    });
  });

  describe('Forbidden Error', (): void => {
    it(`should return ${ErrorCodes.ForbiddenError}`, (): void => {
      const error = new ForbiddenError('ForbiddenError');
      should(error.code).be.equal(ErrorCodes.ForbiddenError);
    });
  });

  describe('Gone Error', (): void => {
    it(`should return ${ErrorCodes.GoneError}`, (): void => {
      const error = new GoneError('GoneError');
      should(error.code).be.equal(ErrorCodes.GoneError);
    });
  });

  describe('Im a Teapot Error', (): void => {
    it(`should return ${ErrorCodes.ImATeapotError}`, (): void => {
      const error = new ImATeapotError('ImATeapotError');
      should(error.code).be.equal(ErrorCodes.ImATeapotError);
    });
  });

  describe('Length Required Error', (): void => {
    it(`should return ${ErrorCodes.LengthRequiredError}`, (): void => {
      const error = new LengthRequiredError('LengthRequiredError');
      should(error.code).be.equal(ErrorCodes.LengthRequiredError);
    });
  });

  describe('Locked Error', (): void => {
    it(`should return ${ErrorCodes.LockedError}`, (): void => {
      const error = new LockedError('LockedError');
      should(error.code).be.equal(ErrorCodes.LockedError);
    });
  });

  describe('Method Not Allowed Error', (): void => {
    it(`should return ${ErrorCodes.MethodNotAllowedError}`, (): void => {
      const error = new MethodNotAllowedError('MethodNotAllowedError');
      should(error.code).be.equal(ErrorCodes.MethodNotAllowedError);
    });
  });

  describe('Misdirected Request Error', (): void => {
    it(`should return ${ErrorCodes.MisdirectedRequestError}`, (): void => {
      const error = new MisdirectedRequestError('MisdirectedRequestError');
      should(error.code).be.equal(ErrorCodes.MisdirectedRequestError);
    });
  });

  describe('Not Acceptable Error', (): void => {
    it(`should return ${ErrorCodes.NotAcceptableError}`, (): void => {
      const error = new NotAcceptableError('NotAcceptableError');
      should(error.code).be.equal(ErrorCodes.NotAcceptableError);
    });
  });

  describe('Not Found Error', (): void => {
    it(`should return ${ErrorCodes.NotFoundError}`, (): void => {
      const error = new NotFoundError('NotFoundError');
      should(error.code).be.equal(ErrorCodes.NotFoundError);
    });
  });

  describe('Payment Required Error', (): void => {
    it(`should return ${ErrorCodes.PaymentRequiredError}`, (): void => {
      const error = new PaymentRequiredError('PaymentRequiredError');
      should(error.code).be.equal(ErrorCodes.PaymentRequiredError);
    });
  });

  describe('Policy Not Fulfilled Error', (): void => {
    it(`should return ${ErrorCodes.PolicyNotFulfilledError}`, (): void => {
      const error = new PolicyNotFulfilledError('PolicyNotFulfilledError');
      should(error.code).be.equal(ErrorCodes.PolicyNotFulfilledError);
    });
  });

  describe('Precondition Failed Error', (): void => {
    it(`should return ${ErrorCodes.PreconditionFailedError}`, (): void => {
      const error = new PreconditionFailedError('PreconditionFailedError');
      should(error.code).be.equal(ErrorCodes.PreconditionFailedError);
    });
  });
});
