# Identity and Access Management - IAM

Contains the implementation of the
[essential-projects IAM contracts](https://github.com/essential-projects/iam_contracts)
interfaces.

## Purpose

The ProcessEngine uses IAM for performing authorization related requests.
The contracts found in `essential-projects/iam_contracts` provide a template for this.

Two services are available:

1. IamService

   Used for interaction with the authority.
   `ensureHasClaim` allows to check if a given identity has a given claim.

2. IdentityService

   A service that knows how to transform a given token (e.g. JWT) to an
   identity that the authority can understand.

**Usage Example:**

The easiest way to get familiar with the idea is to look at an example; this
will illustrate the use of and the interaction between the IamService and the
IdentityService:

```ts
const identityService: IIdentityService = new IdentityService();
const iamService: IIAMService = new IAMService(new HttpClient(), identityService, this.config.introspectPath);

// Get the identity for a given JWT token.
const token: String = "Place JWT Token here";
const identity: IIdentity = identityService.getIdentity(token);

// Will result in:
//
// 1. An UnauthorizedError HTTP Status code, if the identity is not logged in at the authority.
// 2. A ForbiddenError HTTP Status code, if the identity does not have the given claim.
// 3. Nothing, if the identity has the given claim.
iamService.ensureHasClaim(identity, 'allowd_to_read_data');

// Place protected code here.
(...)
```

## Usage

Using IAM is simple. You can use `ensureHasClaim` to verify any claim for any identity.

You'll get one of the following results:

1. Get an Unauthorized Error

   A 401 will be thrown, if the identity is not known to the authority or the
   token is invalid/expired/etc.

2. Get a Forbidden Error

   A 403 will be thrown, if the given identity does not have the given claim.

3. Get Nothing, if the identity has the given claim.

   A 204, which indicates that the identity has the given claim.

## Configuration

The IamService needs some minor configurations; it needs to know:

1. Its authority.
1. The client secret.
