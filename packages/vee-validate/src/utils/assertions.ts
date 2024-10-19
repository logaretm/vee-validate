import { Locator, TypedSchema, YupSchema } from '../types';
import { isCallable, isObject } from '../../../shared';
import { IS_ABSENT } from '../symbols';

export const isClient = typeof window !== 'undefined';

export function isLocator(value: unknown): value is Locator {
  return isCallable(value) && !!(value as Locator).__locatorRef;
}

export function isTypedSchema(value: unknown): value is TypedSchema {
  return !!value && isCallable((value as TypedSchema).parse) && (value as TypedSchema).__type === 'VVTypedSchema';
}

export function isYupValidator(value: unknown): value is YupSchema {
  return !!value && isCallable((value as YupSchema).validate);
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

/**
 * Compares if two values are the same borrowed from:
 * https://github.com/epoberezkin/fast-deep-equal
 * We added a case for file matching since `Object.keys` doesn't work with Files.
 *
 * NB: keys with the value undefined are ignored in the evaluation and considered equal to missing keys.
 * */
export function isEqual(a: any, b: any) {
  if (a === b) return true;

  if (a && b && typeof a === 'object' && typeof b === 'object') {
    if (a.constructor !== b.constructor) return false;

    // eslint-disable-next-line no-var
    var length, i, keys;
    if (Array.isArray(a)) {
      length = a.length;

      if (length != b.length) return false;
      for (i = length; i-- !== 0; ) if (!isEqual(a[i], b[i])) return false;
      return true;
    }

    if (a instanceof Map && b instanceof Map) {
      if (a.size !== b.size) return false;
      for (i of a.entries()) if (!b.has(i[0])) return false;
      for (i of a.entries()) if (!isEqual(i[1], b.get(i[0]))) return false;
      return true;
    }

    // We added this part for file comparison, arguably a little naive but should work for most cases.
    // #3911
    if (isFile(a) && isFile(b)) {
      if (a.size !== b.size) return false;
      if (a.name !== b.name) return false;
      if (a.lastModified !== b.lastModified) return false;
      if (a.type !== b.type) return false;

      return true;
    }

    if (a instanceof Set && b instanceof Set) {
      if (a.size !== b.size) return false;
      for (i of a.entries()) if (!b.has(i[0])) return false;
      return true;
    }

    if (ArrayBuffer.isView(a) && ArrayBuffer.isView(b)) {
      length = (a as any).length;

      if (length != (b as any).length) return false;
      for (i = length; i-- !== 0; ) if ((a as any)[i] !== (b as any)[i]) return false;
      return true;
    }

    if (a.constructor === RegExp) return a.source === b.source && a.flags === b.flags;
    if (a.valueOf !== Object.prototype.valueOf) return a.valueOf() === b.valueOf();
    if (a.toString !== Object.prototype.toString) return a.toString() === b.toString();

    keys = Object.keys(a);
    length = keys.length - countUndefinedValues(a, keys);

    if (length !== Object.keys(b).length - countUndefinedValues(b, Object.keys(b))) return false;

    for (i = length; i-- !== 0; ) {
      if (!Object.prototype.hasOwnProperty.call(b, keys[i])) return false;
    }

    for (i = length; i-- !== 0; ) {
      // eslint-disable-next-line no-var
      var key = keys[i];

      if (!isEqual(a[key], b[key])) return false;
    }

    return true;
  }

  // true if both NaN, false otherwise

  return a !== a && b !== b;
}

function countUndefinedValues(a: any, keys: string[]) {
  let result = 0;
  for (let i = keys.length; i-- !== 0; ) {
    // eslint-disable-next-line no-var
    var key = keys[i];

    if (a[key] === undefined) result++;
  }
  return result;
}

export function isFile(a: unknown): a is File {
  if (!isClient) {
    return false;
  }

  return a instanceof File;
}
