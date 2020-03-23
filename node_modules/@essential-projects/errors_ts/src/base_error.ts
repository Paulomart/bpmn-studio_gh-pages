/* eslint-disable @typescript-eslint/member-naming */
import * as errorClasses from './index';

export class BaseError extends Error {

  public code: number;
  public additionalInformation: any;

  public readonly isEssentialProjectsError = true;

  constructor(code: number, message: string) {
    super(message);
    this.code = code;
    this.name = this.constructor.name;

    // Currently, Firefox and Safari do not support the stack method.
    // NOTE: We need that cast to any, otherwise the Builds in Jenkins will fail.
    // This is because the environment on Jenkins apparently doesn't recognize this property.
    const captureStackTraceMethodAvailable: boolean = (Error as any).captureStackTrace !== undefined;
    if (captureStackTraceMethodAvailable) {
      // For NodeJS and Chrome
      Error.captureStackTrace(this, this.constructor);
    } else {
      // Fallback for others like Firefox, IE 10+, Safari etc.
      this.stack = (new Error()).stack || '';
    }
  }

  public static deserialize(serializedError: string): BaseError {
    let errorInfo: any;

    try {
      errorInfo = JSON.parse(serializedError);
    } catch (error) {
      throw new Error(`Error while deserializing an essential-projects-error: Couldn't parse string: ${error.message}`);
    }

    const errorClassUndefined = errorInfo.errorClassName === undefined;
    const codeUndefined = errorInfo.code === undefined;
    const callStackUndefined = errorInfo.callStack === undefined;

    const structureIsIncorrect = errorClassUndefined || codeUndefined || callStackUndefined;

    if (structureIsIncorrect) {
      throw new Error('Error while deserializing an essential-projects-error: Serialized object has the wrong structure.');
    }

    const errorClassIsUnknown = errorClasses[errorInfo.errorClassName] === undefined;
    if (errorClassIsUnknown) {
      throw new Error(`Error while deserializing an essential-projects-error: ${errorInfo.errorClassName} is not a known essential-projects-error`);
    }

    const errorClass = new errorClasses[errorInfo.errorClassName](errorInfo.message);
    errorClass.stack = errorInfo.callStack;
    errorClass.additionalInformation = errorInfo.additionalInformation;

    return errorClass;
  }

  public serialize(): string {

    let essentialProjectsErrorName = this.constructor.name;

    const errorClassIsUnknown = errorClasses[this.constructor.name] === undefined;
    if (errorClassIsUnknown) {
      // the error we want to serailize is not a known essential-projects-error.
      // It might extend one, and if so, we need to find the essential-projects-
      // error this one is based on.

      // eslint-disable-next-line @typescript-eslint/no-this-alias
      let classToCheck = this;

      while (classToCheck !== undefined) {
        const currentClassInPrototypeChainIsSearchedFor = classToCheck.constructor !== undefined
                                                        && errorClasses[classToCheck.constructor.name] !== undefined;
        if (currentClassInPrototypeChainIsSearchedFor) {
          // We found the essential-projects-error this one is based on.
          essentialProjectsErrorName = classToCheck.constructor.name;
          break;
        }

        classToCheck = Object.getPrototypeOf(classToCheck);
      }

      const essentialProjectsErrorNotFound = !classToCheck;
      if (essentialProjectsErrorNotFound) {
        // eslint-disable-next-line max-len
        throw new Error('Method \'serialize\' was called on an error that extends an essential-projects BaseError, but no known essential-projects error was found in its prototype-chain. THIS SHOULD NEVER HAPPEN! Are you using mutliple versions of @essential-projects/errors_ts in your project?');
      }
    }

    return JSON.stringify({
      errorClassName: essentialProjectsErrorName,
      code: this.code,
      message: this.message,
      callStack: this.stack,
      additionalInformation: this.additionalInformation,
    });
  }

}
