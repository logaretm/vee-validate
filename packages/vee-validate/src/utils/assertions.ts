import { Locator, YupValidator } from '../types';
import { isCallable, isObject } from '../../../shared';
import { IS_ABSENT } from '../symbols';

export function isLocator(value: unknown): value is Locator {
  return isCallable(value) && !!(value as Locator).__locatorRef;
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

export function isYupValidator(value: unknown): value is YupValidator {
  return !!value && isCallable((value as { validate?: () => unknown }).validate);
}

export function hasCheckedAttr(type: unknown) {
  return type === 'checkbox' || type === 'radio';
}

export function isContainerValue(value: unknown): value is Record<string, unknown> {
  return isObject(value) || Array.isArray(value);
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
  return isNativeSelect(el) && el.multiple;
}

/**
 * Checks if an element is a native HTML5 select input element
 */
export function isNativeSelect(el: HTMLElement): el is HTMLSelectElement {
  return el.tagName === 'SELECT';
}

/**
 * Checks if a tag name with attrs object will render a native multi-select element
 */
export function isNativeMultiSelectNode(tag: string, attrs: Record<string, unknown>) {
  // The falsy value array is the values that Vue won't add the `multiple` prop if it has one of these values
  const hasTruthyBindingValue =
    ![false, null, undefined, 0].includes(attrs.multiple as boolean) && !Number.isNaN(attrs.multiple);

  return tag === 'select' && 'multiple' in attrs && hasTruthyBindingValue;
}

/**
 * Checks if a node should have a `:value` binding or not
 *
 * These nodes should not have a value binding
 * For files, because they are not reactive
 * For multi-selects because the value binding will reset the value
 */
export function shouldHaveValueBinding(tag: string, attrs: Record<string, unknown>) {
  return !isNativeMultiSelectNode(tag, attrs) && attrs.type !== 'file' && !hasCheckedAttr(attrs.type);
}

export function isFormSubmitEvent(evt: unknown): evt is Event & { target: HTMLFormElement } {
  return isEvent(evt) && (evt as any).target && 'submit' in (evt as any).target;
}

export function isEvent(evt: unknown): evt is Event {
  if (!evt) {
    return false;
  }

  if (typeof Event !== 'undefined' && isCallable(Event) && evt instanceof Event) {
    return true;
  }

  // this is for IE and Cypress #3161
  /* istanbul ignore next */
  if (evt && (evt as Event).srcElement) {
    return true;
  }

  return false;
}

export function isPropPresent(obj: Record<string, unknown>, prop: string) {
  return prop in obj && obj[prop] !== IS_ABSENT;
}
