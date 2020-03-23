import {BaseError} from './base_error';
import {isEssentialProjectsError} from './is_error';

interface ISerializedErrorFrame {
  message: string;
  name: string;
  stack: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function serializeError(error: Error | BaseError | any): string {

  if (isEssentialProjectsError(error)) {
    return error.serialize();
  }

  if (error instanceof Error) {

    const errorJson: ISerializedErrorFrame = {
      message: error.message || '',
      name: error.name || '',
      stack: error.stack || '',
    };

    return JSON.stringify(errorJson);
  }

  return JSON.stringify(error);
}

export function deserializeError(stringifiedError: string): Error | BaseError {

  try {
    const result = BaseError.deserialize(stringifiedError);
    return result;
  } catch (error) {
    return deserializeBasicError(stringifiedError);
  }
}

function deserializeBasicError(stringifiedError: string): Error {
  const deserializedValue = tryParse(stringifiedError);

  const notAnError = !deserializedValue.name || !deserializedValue.message || !deserializedValue.stack;

  if (notAnError) {
    return deserializedValue;
  }

  const error = new Error(deserializedValue.message);
  error.stack = deserializedValue.stack;
  error.name = deserializedValue.name;

  return error;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function tryParse(value: string): ISerializedErrorFrame | any {
  try {
    const result = JSON.parse(value);

    return result;
  } catch (error) {
    return value;
  }
}
