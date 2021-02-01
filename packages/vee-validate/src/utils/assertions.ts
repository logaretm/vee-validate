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

/**
 * Checks if an input is of type file
 */
export function isFileInputNode(tag: string, attrs: Record<string, unknown>) {
  return isHTMLTag(tag) && attrs.type === 'file';
}

type YupValidator = { validate: (value: any) => Promise<void | boolean> };

export function isYupValidator(value: unknown): value is YupValidator {
  return !!value && isCallable((value as any).validate);
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

/**
 * Checks if the path opted out of nested fields using `[fieldName]` syntax
 */
export function isNotNestedPath(path: string) {
  return /^\[.+\]$/i.test(path);
}

/**
 * Checks if an element is a native HTML5 multi-select input element
 */
export function isNativeMultiSelect(el: HTMLElement): el is HTMLSelectElement {
  return el.tagName === 'SELECT' && (el as HTMLSelectElement).multiple;
}

/**
 * Checks if a tag name with attrs object will render a native multi-select element
 */
export function isNativeMultiSelectNode(tag: string, attrs: Record<string, unknown>) {
  return tag === 'select' && 'multiple' in attrs && ![false, null, undefined].includes(attrs.multiple as boolean);
}

/**
 * Checks if a node should have a `:value` binding or not
 *
 * These nodes should not have a value binding
 * For files, because they are not reactive
 * For multi-selects because the value binding will reset the value
 */
export function shouldHaveValueBinding(tag: string, attrs: Record<string, unknown>) {
  return isNativeMultiSelectNode(tag, attrs) || isFileInputNode(tag, attrs);
}
