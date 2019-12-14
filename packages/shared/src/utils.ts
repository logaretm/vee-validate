export function isCallable(fn: unknown): fn is Function {
  return typeof fn === 'function';
}

/**
 * Converts an array-like object to array, provides a simple polyfill for Array.from
 */
export function toArray<T>(arrayLike: ArrayLike<T>): T[] {
  if (isCallable(Array.from)) {
    return Array.from(arrayLike);
  }

  /* istanbul ignore next */
  return _copyArray(arrayLike);
}

/* istanbul ignore next */
function _copyArray<T>(arrayLike: ArrayLike<T>): T[] {
  const array = [];
  const length = arrayLike.length;
  for (let i = 0; i < length; i++) {
    array.push(arrayLike[i]);
  }

  return array;
}

export function isNullOrUndefined(value: unknown): value is undefined | null {
  return value === null || value === undefined;
}

export function isEmptyArray(arr: any[]): boolean {
  return Array.isArray(arr) && arr.length === 0;
}

export function includes(collection: any[] | string, item: any): boolean {
  return collection.indexOf(item) !== -1;
}
