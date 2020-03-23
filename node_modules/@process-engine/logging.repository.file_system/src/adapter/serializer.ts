import {BaseError, isEssentialProjectsError} from '@essential-projects/errors_ts';

export function serialize(error: Error | string): string {

  const errorIsFromEssentialProjects = isEssentialProjectsError(error);
  if (errorIsFromEssentialProjects) {
    return (error as BaseError).serialize();
  }

  const errorIsString = typeof error === 'string';
  if (errorIsString) {
    return error as string;
  }

  return JSON.stringify(error);
}

export function deserialize(error: string): Error {

  const essentialProjectsError = tryDeserializeEssentialProjectsError(error);

  const errorIsFromEssentialProjects = essentialProjectsError !== undefined;

  if (errorIsFromEssentialProjects) {
    return essentialProjectsError;
  }

  return tryParse(error);
}

export function tryDeserializeEssentialProjectsError(value: string): Error {
  try {
    return BaseError.deserialize(value);
  } catch (error) {
    return undefined;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function tryParse(value: string): any {
  try {
    return JSON.parse(value);
  } catch (error) {
    // Value is not a JSON - return it as it is.
    return value;
  }
}
