import {BaseError} from './base_error';

export function isEssentialProjectsError(error: any): error is BaseError {
  return (error instanceof Error) && (error as BaseError).isEssentialProjectsError === true;
}

// This helps us tell typescript that we want to use a class as a type instead of an instance of a class!
export type IClassOf<TClass> = new (...args: Array<any>) => TClass;

// The following makes the function be a typeguard for whatever Class is in the second argument
export function isError<TError extends BaseError>(error: any, errorClass: IClassOf<TError>): error is TError {
  if (!isEssentialProjectsError(error)) {
    return false;
  }

  let classToCheck = error;

  const constructorNamesMatch = classToCheck.constructor !== undefined
                             && classToCheck.constructor.name === errorClass.name;
  if (constructorNamesMatch) {
    return true;
  }

  classToCheck = Object.getPrototypeOf(classToCheck);

  return false;
}
