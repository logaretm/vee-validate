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
 * A reference comparison function with NaN support
 */
export function isRefEqual(lhs: any, rhs: any) {
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

// eslint-disable-next-line @typescript-eslint/ban-types
export function isCallable(fn: unknown): fn is Function {
  return typeof fn === 'function';
}

export function isLocator(value: unknown): value is Locator {
  return isCallable(value) && !!(value as any).__locatorRef;
}
