import { isCallable, isObject } from './assertions';

export function findIndex<T>(arrayLike: ArrayLike<T>, predicate: (item: T, idx: number) => boolean): number {
  const array = Array.isArray(arrayLike) ? arrayLike : toArray(arrayLike);
  if (isCallable(array.findIndex)) {
    return array.findIndex(predicate);
  }

  /* istanbul ignore next */
  for (let i = 0; i < array.length; i++) {
    if (predicate(array[i], i)) {
      return i;
    }
  }

  /* istanbul ignore next */
  return -1;
}

/**
 * finds the first element that satisfies the predicate callback, polyfills array.find
 */
export function find<T>(arrayLike: ArrayLike<T>, predicate: (item: T, idx: number) => boolean): T | undefined {
  const array = Array.isArray(arrayLike) ? arrayLike : toArray(arrayLike);
  const idx = findIndex(array, predicate);

  return idx === -1 ? undefined : array[idx];
}

export function includes(collection: any[] | string, item: any): boolean {
  return collection.indexOf(item) !== -1;
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

export function values<T>(obj: { [x: string]: T }): T[] {
  if (isCallable(Object.values)) {
    return Object.values(obj);
  }

  // fallback to keys()
  /* istanbul ignore next */
  return Object.keys(obj).map(k => obj[k]);
}

export function merge(target: any, source: any) {
  Object.keys(source).forEach(key => {
    if (isObject(source[key])) {
      if (!target[key]) {
        target[key] = {};
      }

      merge(target[key], source[key]);
      return;
    }

    target[key] = source[key];
  });

  return target;
}
