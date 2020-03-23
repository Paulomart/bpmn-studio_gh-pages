import * as should from 'should';

import {BadRequestError} from '@essential-projects/errors_ts';
import {IIdentity} from '@essential-projects/iam_contracts';

import {IdentityService} from '../../dist/commonjs/identity_service';

describe('IdentityService.getIdentity()', (): void => {

  let identityService;

  before((): void => {
    identityService = new IdentityService();
  });

  // eslint-disable-next-line
  const sampleToken = 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjdmNTI3YmM1YjUyZTlmMDM5OGIzZTRkYzE4NmI2ZWE2IiwidHlwIjoiSldUIn0.eyJuYmYiOjE1NjIwNTE4NzksImV4cCI6MTU2MjA1NTQ3OSwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo1MDAwIiwiYXVkIjpbImh0dHA6Ly9sb2NhbGhvc3Q6NTAwMC9yZXNvdXJjZXMiLCJ0ZXN0X3Jlc291cmNlIl0sImNsaWVudF9pZCI6ImJwbW5fc3R1ZGlvIiwic3ViIjoiOThhNDQzNmYtOTk4ZC00YWZhLTkzYWItZTUzYTlhMTA1NTNhIiwiYXV0aF90aW1lIjoxNTYyMDUxODc5LCJpZHAiOiJsb2NhbCIsIkRlZmF1bHRfVGVzdF9MYW5lIjoiMTIzIiwiTGFuZUEiOiJ0cnVlIiwiTGFuZUIiOiJ0cnVlIiwiTGFuZUMiOiJ0cnVlIiwiY2FuX3JlYWRfcHJvY2Vzc19tb2RlbCI6InRydWUiLCJjYW5fd3JpdGVfcHJvY2Vzc19tb2RlbCI6InRydWUiLCJjYW5fY3JlYXRlX2xvY2FsX2FkbWluIjoidHJ1ZSIsIkFnZW50IjoidHJ1ZSIsIm5hbWUiOiJhbGljZSIsInNjb3BlIjpbIm9wZW5pZCIsInByb2ZpbGUiLCJ0ZXN0X3Jlc291cmNlIl0sImFtciI6WyJwd2QiXX0.AroGYUY-kCP3NVfn2-TxwvVvEMN4B97ZxeqR7hse7J-9jatdN1NsmS3Tj_GD7pluBFJmq0sZSHWRL1qk356eTNzgpZCoBCLcgBwoL2s3eFAWrr5V_K4x2PSdbpyFf1_ffdg25_c1WikaPLJElmKTcNoH8M1Bn3bVw4bAt7mOz_9IhGUN5FNjMj4kIEOpY9aN-GHCzhrCwRtj-AwOuEn1Gp9dkmTYwlTALH9-rMCa8SyI5RNL47LaY9cBLp9EBXOfSlDcqe2gxVPC_3EKtbX1sSUf4x9gU0hQlXcQ6TTzFmuyBRtA8IkZXykZq1BNCC2CgurXBoajVh90qPuezKasKA';
  const dummyToken = 'ZHVtbXlfdG9rZW4=';
  const internalToken = 'UHJvY2Vzc0VuZ2luZUludGVybmFsVXNlcg==';
  const sampleInvalidToken = 'invalid';

  it('Should correctly decode the given token and parse it into an IIdentity', async (): Promise<void> => {
    const parsedIdentity = await identityService.getIdentity(sampleToken);
    should(parsedIdentity.token).be.equal(sampleToken);
    should(parsedIdentity.userId).be.equal('98a4436f-998d-4afa-93ab-e53a9a10553a');
  });

  it('Should correctly decode the given dummy token and parse it into an internal IIdentity', async (): Promise<void> => {
    const parsedIdentity = await identityService.getIdentity(internalToken);
    should(parsedIdentity.token).be.equal(internalToken);
    should(parsedIdentity.userId).be.equal('ProcessEngineInternalUser');
  });

  it('Should correctly decode the given dummy token and parse it into a dummy IIdentity', async (): Promise<void> => {
    const parsedIdentity = await identityService.getIdentity(dummyToken);
    should(parsedIdentity.token).be.equal(dummyToken);
    should(parsedIdentity.userId).be.equal('dummy_token');
  });

  it('Should throw an error, if getIdentity is called without any parameters', (): void => {
    const expectedError = new BadRequestError('Must provide a token by which to create an identity!');
    should((): Promise<IIdentity> => identityService.getIdentity()).throwError(expectedError);
  });

  it('Should throw an error, if the given token is invalid', (): void => {
    should((): Promise<IIdentity> => identityService.getIdentity(sampleInvalidToken)).throw();
  });

  it('Should throw an error, if multiple tokens are passed', (): void => {
    const concatToken = `${sampleToken}, ${sampleToken}`;
    should((): Promise<IIdentity> => identityService.getIdentity(concatToken)).throw();
  });

  it('Should throw an error, if the given token is not a string', (): void => {
    should((): Promise<IIdentity> => identityService.getIdentity(123)).throw();
  });

});
