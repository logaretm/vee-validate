import { Locator } from '../types';
import { isCallable } from '@vee-validate/shared';

export { isCallable };

export const isObject = (obj: unknown): obj is { [x: string]: any } =>
  obj !== null && obj && typeof obj === 'object' && !Array.isArray(obj);

export function isLocator(value: unknown): value is Locator {
  return isCallable(value) && !!(value as any).__locatorRef;
}
