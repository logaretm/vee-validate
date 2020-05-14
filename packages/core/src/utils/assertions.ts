import { Locator } from '../types';
import { isCallable, isNullOrUndefined, isEmptyArray } from '@vee-validate/shared';

export { isCallable, isNullOrUndefined, isEmptyArray };

export function isNaN(value: unknown): boolean {
  // NaN is the one value that does not equal itself.
  // eslint-disable-next-line
  return value !== value;
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

export function isLocator(value: unknown): value is Locator {
  return isCallable(value) && !!(value as any).__locatorRef;
}
