import { Locator } from '../types';
import { isCallable, isObject } from '../../../shared';

export function isLocator(value: unknown): value is Locator {
  return isCallable(value) && !!(value as any).__locatorRef;
}

/**
 * Checks if an tag name is a native HTML tag and not a Vue component
 */
export function isHTMLTag(tag: string) {
  return ['input', 'textarea', 'select'].includes(tag);
}

type YupValidator = { validate: (value: any) => Promise<void | boolean> };

export function isYupValidator(value: unknown): value is YupValidator {
  return value && isCallable((value as any).validate);
}

export function hasCheckedAttr(type: unknown) {
  return type === 'checkbox' || type === 'radio';
}

export function isIndex(value: unknown): value is number {
  return Number(value) >= 0;
}

/**
 * True if the value is an empty object or array
 */
export function isEmptyContainer(value: unknown): boolean {
  if (Array.isArray(value)) {
    return value.length === 0;
  }

  return isObject(value) && Object.keys(value).length === 0;
}
