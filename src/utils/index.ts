import { Locator } from '../types';

export function isNaN(value: unknown): boolean {
  // NaN is the one value that does not equal itself.
  // eslint-disable-next-line
  return value !== value;
}

export function isNullOrUndefined(value: unknown): value is undefined | null {
  return value === null || value === undefined;
}

export function isEmptyArray(arr: any[]): boolean {
  return Array.isArray(arr) && arr.length === 0;
}

export const isObject = (obj: unknown): obj is { [x: string]: any } =>
  obj !== null && obj && typeof obj === 'object' && !Array.isArray(obj);

/**
 * Shallow object comparison.
 */
export function isEqual(lhs: any, rhs: any): boolean {
  if (lhs instanceof RegExp && rhs instanceof RegExp) {
    return isEqual(lhs.source, rhs.source) && isEqual(lhs.flags, rhs.flags);
  }

  if (Array.isArray(lhs) && Array.isArray(rhs)) {
    if (lhs.length !== rhs.length) return false;

    for (let i = 0; i < lhs.length; i++) {
      if (!isEqual(lhs[i], rhs[i])) {
        return false;
      }
    }

    return true;
  }

  // if both are objects, compare each key recursively.
  if (isObject(lhs) && isObject(rhs)) {
    return (
      Object.keys(lhs).every(key => {
        return isEqual(lhs[key], rhs[key]);
      }) &&
      Object.keys(rhs).every(key => {
        return isEqual(lhs[key], rhs[key]);
      })
    );
  }

  if (isNaN(lhs) && isNaN(rhs)) {
    return true;
  }

  return lhs === rhs;
}

// Checks if a given value is not an empty string or null or undefined.
export function isSpecified(val: string | null | undefined): boolean {
  if (val === '') {
    return false;
  }

  return !isNullOrUndefined(val);
}

export function isLocator(value: unknown): value is Locator {
  return isCallable(value) && !!(value as any).__locatorRef;
}

export function isCallable(fn: unknown): fn is Function {
  return typeof fn === 'function';
}

export function identity<T>(x: T): T {
  return x;
}

export function debounce(fn: Function, wait = 0, token = { cancelled: false }) {
  if (wait === 0) {
    return fn;
  }

  let timeout: ReturnType<typeof setTimeout> | undefined;

  return (...args: any[]) => {
    const later = () => {
      timeout = undefined;

      // check if the fn call was cancelled.
      if (!token.cancelled) fn(...args);
    };

    // because we might want to use Node.js setTimout for SSR.
    clearTimeout(timeout as any);
    timeout = setTimeout(later, wait) as any;
  };
}

/**
 * Emits a warning to the console.
 */
export function warn(message: string) {
  console.warn(`[vee-validate] ${message}`);
}

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

export function interpolate(template: string, values: Record<string, any>): string {
  return template.replace(/{([^}]+)}/g, (_, p): string => {
    return p in values ? values[p] : `{${p}}`;
  });
}
