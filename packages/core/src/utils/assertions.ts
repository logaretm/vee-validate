import { Locator } from '../types';
import { isCallable } from '../../../shared';

export function isLocator(value: unknown): value is Locator {
  return isCallable(value) && !!(value as any).__locatorRef;
}
