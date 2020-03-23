import {Logger} from 'loggerhythm';

const logger = Logger.createLogger('processengine:management_api_core:paginator');

export function applyPagination<TValue>(values: Array<TValue>, offset: number, limit: number): Array<TValue> {

  if (offset > values.length) {
    logger.warn(`The offset of ${offset} is larger than the given value list (${values.length})! Returning an empty result set.`);
    return [];
  }

  let valueSubset = offset > 0
    ? values.slice(offset)
    : values;

  const limitIsOutOfValueListBounds = limit < 1 || limit >= valueSubset.length;
  if (limitIsOutOfValueListBounds) {
    return valueSubset;
  }

  valueSubset = valueSubset.slice(0, limit);

  return valueSubset;
}
