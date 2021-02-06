import { isObject } from '../../../shared';
import { getCurrentInstance, inject, InjectionKey, warn as vueWarning } from 'vue';
import type { useField } from '../useField';
import { isContainerValue, isEmptyContainer, isIndex, isNotNestedPath } from './assertions';

function cleanupNonNestedPath(path: string) {
  if (isNotNestedPath(path)) {
    return path.replace(/\[|\]/gi, '');
  }

  return path;
}

type NestedRecord = Record<string, unknown> | { [k: string]: NestedRecord };

/**
 * Gets a nested property value from an object
 */
export function getFromPath<TValue = unknown>(object: NestedRecord | undefined, path: string): TValue | undefined {
  if (!object) {
    return undefined;
  }

  if (isNotNestedPath(path)) {
    return object[cleanupNonNestedPath(path)] as TValue | undefined;
  }

  const resolvedValue = path
    .split(/\.|\[(\d+)\]/)
    .filter(Boolean)
    .reduce((acc, propKey) => {
      if (isContainerValue(acc) && propKey in acc) {
        return acc[propKey];
      }

      return undefined;
    }, object as unknown);

  return resolvedValue as TValue | undefined;
}

/**
 * Sets a nested property value in a path, creates the path properties if it doesn't exist
 */
export function setInPath(object: NestedRecord, path: string, value: unknown): void {
  if (isNotNestedPath(path)) {
    object[cleanupNonNestedPath(path)] = value;
    return;
  }

  const keys = path.split(/\.|\[(\d+)\]/).filter(Boolean);
  let acc: Record<string, unknown> = object;
  for (let i = 0; i < keys.length; i++) {
    // Last key, set it
    if (i === keys.length - 1) {
      acc[keys[i]] = value;
      return;
    }

    // Key does not exist, create a container for it
    if (!(keys[i] in acc)) {
      // container can be either an object or an array depending on the next key if it exists
      acc[keys[i]] = isIndex(keys[i + 1]) ? [] : {};
    }

    acc = acc[keys[i]] as Record<string, unknown>;
  }
}

function unset(object: Record<string, unknown> | unknown[], key: string | number) {
  if (Array.isArray(object) && isIndex(key)) {
    object.splice(Number(key), 1);
    return;
  }

  if (isObject(object)) {
    delete object[key];
  }
}

/**
 * Removes a nested property from object
 */
export function unsetPath(object: NestedRecord, path: string): void {
  if (isNotNestedPath(path)) {
    delete object[cleanupNonNestedPath(path)];
    return;
  }

  const keys = path.split(/\.|\[(\d+)\]/).filter(Boolean);
  let acc: Record<string, unknown> = object;
  for (let i = 0; i < keys.length; i++) {
    // Last key, unset it
    if (i === keys.length - 1) {
      unset(acc, keys[i]);
      break;
    }

    // Key does not exist, exit
    if (!(keys[i] in acc)) {
      break;
    }

    acc = acc[keys[i]] as Record<string, unknown>;
  }

  const pathValues: (unknown | Record<string, unknown>)[] = keys.map((_, idx) => {
    return getFromPath(object, keys.slice(0, idx).join('.'));
  });

  for (let i = pathValues.length - 1; i >= 0; i--) {
    if (!isEmptyContainer(pathValues[i])) {
      continue;
    }

    if (i === 0) {
      unset(object, keys[0]);
      continue;
    }

    unset(pathValues[i - 1] as Record<string, unknown>, keys[i - 1]);
  }
}

/**
 * A typed version of Object.keys
 */
export function keysOf<TRecord extends Record<string, unknown>>(record: TRecord): (keyof TRecord)[] {
  return Object.keys(record);
}

// Uses same component provide as its own injections
// Due to changes in https://github.com/vuejs/vue-next/pull/2424
export function injectWithSelf<T>(symbol: InjectionKey<T>, def: T | undefined = undefined): T | undefined {
  const vm = getCurrentInstance() as any;

  return inject(symbol, vm?.provides[symbol as any] || def);
}

export function warn(message: string) {
  vueWarning(`[vee-validate]: ${message}`);
}

type FieldApi = ReturnType<typeof useField>;

/**
 * Ensures we deal with a singular field value
 */
export function normalizeField(field: FieldApi | FieldApi[]): FieldApi | undefined {
  if (Array.isArray(field)) {
    return field[0];
  }

  return field;
}

export function resolveNextCheckboxValue<T>(currentValue: T, checkedValue: T, uncheckedValue: T): T;
export function resolveNextCheckboxValue<T>(currentValue: T[], checkedValue: T, uncheckedValue: T): T[];
export function resolveNextCheckboxValue<T>(currentValue: T | T[], checkedValue: T, uncheckedValue: T) {
  if (Array.isArray(currentValue)) {
    const newVal = [...currentValue];
    const idx = newVal.indexOf(checkedValue);
    idx >= 0 ? newVal.splice(idx, 1) : newVal.push(checkedValue);

    return newVal;
  }

  return currentValue === checkedValue ? uncheckedValue : checkedValue;
}
