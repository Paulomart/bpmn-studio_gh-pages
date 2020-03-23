# Errors_ts

A technical error provider.

## Usage

1. If you build a transport layer, ...

   ... you can implement the handling of the Technical Errors provided by this
   package, so that when someone uses your layer, and an error ist thrown, you
   can handle it correctly.

1. If you want to use essential-projects-errors, ...

   ... you can just use the Errors provided by this package directly, or write your
   own non-technical errors that extend these errors.

   Every library that can handle these errors will be able to also correctly handle
   your extensions of these errors.

1. Either way...

   ... you just need to install it with:

   ```bash
   npm install --save @essential-projects/errors_ts
   ```

   And then import the errors like this:

   ```js
   // JavaScript-variant
   const ERRORNAME = require('@essential-projects/errors_ts').ERRORNAME`

   // typescript-variant
   import {ERRORNAME1, ERRORNAME2, ERRORNAME3} from '@essential-projects/errors_ts';
   ```

   Where `ERRORNAME` is the name error you want to import.

   All essential-projects-errors have the `isEssentialProjectsError`-property, so they can be identified as such.

# Test

In order to run the test:

```bash
npm test
```

# Errors

The Errors are mostly based on
[http-status-codes](https://de.wikipedia.org/wiki/HTTP-Statuscode).
Every Error, except for the `BaseError` directly extends `BaseError`, and
`BaseError` extends `Error`


| Name                               | Code    |
| ---                                | ---     |
| BaseError                          |         |
|                                    |         |
| **Information Errors**             | **1xx** |
| ContinueError                      | 100     |
| SwitchingProtocolsError            | 101     |
| ProcessingError                    | 102     |
|                                    |         |
| **Redirect Errors**                | **3xx** |
| MultipleChoicesError               | 300     |
| MovedError                         | 301     |
| FoundError                         | 302     |
| SeeOtherError                      | 303     |
| NotModifiedError                   | 304     |
| UseProxyError                      | 305     |
| TemporaryRedirectError             | 307     |
| PermanentRedirectError             | 308     |
|                                    |         |
| **Client Errors**                  | **4xx** |
| BadRequestError                    | 400     |
| UnauthorizedError                  | 401     |
| PaymentRequiredError               | 402     |
| ForbiddenError                     | 403     |
| NotFoundError                      | 404     |
| MethodNotAllowedError              | 405     |
| NotAcceptableError                 | 406     |
| ProxyAuthenticationRequiredError   | 407     |
| RequestTimeoutError                | 408     |
| ConflictError                      | 409     |
| GoneError                          | 410     |
| LengthRequiredError                | 411     |
| PreconditionFailedError            | 412     |
| RequestTooLargeError               | 413     |
| URLTooLongError                    | 414     |
| UnsupportedMediaTypeError          | 415     |
| RequestedRangeNotSatisfiableError  | 416     |
| ExpectationFailedError             | 417     |
| ImATeapotError                     | 418     |
| PolicyNotFulfilledError            | 420     |
| MisdirectredRequestError           | 421     |
| UnprocessableEntityError           | 422     |
| LockedError                        | 423     |
| FailedDependencyError              | 424     |
| UpgradeRequiredError               | 426     |
| PreconditionRequiredError          | 428     |
| TooManyRequestsError               | 429     |
| RequestHeaderTooLargeError         | 431     |
| UnavaliableForLegalReasonsError    | 451     |
|                                    |         |
| **Server Errors**                  | **5xx** |
| InternalServerError                | 500     |
| NotImplementedError                | 501     |
| BadGatewayError                    | 502     |
| ServiceUnavaliableError            | 503     |
| GatewayTimeoutError                | 504     |
| VersionNotSupportedError           | 505     |
| InsufficientStorageError           | 507     |
| LoopDetectedError                  | 508     |
| BandwithLimitExceededError         | 509     |
| NetworkAuthenticationRequiredError | 511     |
