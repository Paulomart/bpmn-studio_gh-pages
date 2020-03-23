import 'mocha';
import * as should from 'should';

import {
  InternalServerError,
  deserializeError,
  serializeError,
} from '../src/index';

describe('Error Serializer', (): void => {

  describe('Serialize Error', (): void => {

    it('Should successfully serialize an Essential-Projects error', (): void => {
      const testError = new InternalServerError('I am a test error');
      testError.additionalInformation = 'HelloHello';
      const serializedError = serializeError(testError);

      const hasErrorClassName = serializedError.indexOf('"errorClassName":"InternalServerError"') > -1;
      const hasErrorCode = serializedError.indexOf('"code":500') > -1;
      const hasStack = serializedError.indexOf('"callStack"') > -1;
      const hasMessage = serializedError.indexOf('"message":"I am a test error"') > -1;
      const hasAdditionalInfo = serializedError.indexOf('"additionalInformation":"HelloHello"') > -1;

      should(hasErrorClassName).be.true('Failed to serialize the error\'s name!');
      should(hasErrorCode).be.true('Failed to serialize the error\'s code!');
      should(hasStack).be.true('Failed to serialize the error\'s stack!');
      should(hasMessage).be.true('Failed to serialize the error\'s message!');
      should(hasAdditionalInfo).be.true('Failed to serialize the error\'s additionalInformation!');
    });

    it('Should successfully serialize a standard error', (): void => {
      const testError = new Error('I am a standard error');
      const serializedError = serializeError(testError);

      const hasName = serializedError.indexOf('"name":"Error"') > -1;
      const hasMessage = serializedError.indexOf('"message":"I am a standard error"') > -1;
      const hasStack = serializedError.indexOf('"stack"') > -1;

      should(hasName).be.true('Failed to serialize the error\'s name!');
      should(hasMessage).be.true('Failed to serialize the error\'s message!');
      should(hasStack).be.true('Failed to serialize the error\'s stack!');
    });

    it('Should successfully serialize a custom error', (): void => {
      const testError = {
        name: 'BpmnError',
        code: 'xxx',
        message: 'Hello World',
      };
      const serializedError = serializeError(testError);

      const hasName = serializedError.indexOf('"name":"BpmnError"') > -1;
      const hasMessage = serializedError.indexOf('"message":"Hello World"') > -1;
      const hasCode = serializedError.indexOf('"code":"xxx"') > -1;

      should(hasName).be.true('Failed to serialize the error\'s name!');
      should(hasMessage).be.true('Failed to serialize the error\'s message!');
      should(hasCode).be.true('Failed to serialize the error\'s code!');
    });

  });

  describe('Deserialize Error', (): void => {

    it('Should successfully deserialize an Essential-Projects error', (): void => {

      const testError = new InternalServerError('I am a test error');
      testError.additionalInformation = 'HelloHello';

      const testValue = serializeError(testError);

      const deserializedError = <InternalServerError> deserializeError(testValue);

      should(deserializedError).be.eql(testError);
    });

    it('Should successfully deserialize a standard error', (): void => {

      const testValue = serializeError(new Error('I am a standard error'));

      const deserializedError = <Error> deserializeError(testValue);
      should(deserializedError).be.an.instanceOf(Error);
      should(deserializedError.message).be.equal('I am a standard error');
      should(deserializedError).have.a.property('stack');
    });

    it('Should not crash when trying to deserialize customized, untyped errors', (): void => {

      const testValue = {
        name: 'BpmnError',
        code: 'xxx',
        message: 'Hello World',
      };

      const deserializedError = deserializeError(JSON.stringify(testValue));

      should(deserializedError).eql(testValue);
    });

  });

});
