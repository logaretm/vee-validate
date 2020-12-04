import { getCurrentInstance, inject, InjectionKey } from 'vue';
import { isEmptyContainer, isIndex, isNotNestedPath } from './assertions';

function cleanupNonNestedPath(path: string) {
  if (isNotNestedPath(path)) {
    return path.replace(/\[|\]/gi, '');
  }

  return path;
}

/**
 * Gets a nested property value from an object
 */
export function getFromPath(object: Record<string, any> | undefined, path: string): any {
  if (!object) {
    return undefined;
  }

  if (isNotNestedPath(path)) {
    return object[cleanupNonNestedPath(path)];
  }

  return path
    .split(/\.|\[(\d+)\]/)
    .filter(Boolean)
    .reduce((acc, propKey) => {
      if (acc && propKey in acc) {
        return acc[propKey];
      }

      return undefined;
    }, object);
}

/**
 * Sets a nested property value in a path, creates the path properties if it doesn't exist
 */
export function setInPath(object: Record<string, any>, path: string, value: any): void {
  if (isNotNestedPath(path)) {
    object[cleanupNonNestedPath(path)] = value;
    return;
  }

  const keys = path.split(/\.|\[(\d+)\]/).filter(Boolean);
  let acc = object;
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

    acc = acc[keys[i]];
  }
}

function unset(object: any, key: string | number) {
  if (Array.isArray(object) && isIndex(key)) {
    object.splice(Number(key), 1);
    return;
  }

  delete object[key];
}

/**
 * Removes a nested property from object
 */
export function unsetPath(object: Record<string, any>, path: string): void {
  if (isNotNestedPath(path)) {
    delete object[cleanupNonNestedPath(path)];
    return;
  }

  const keys = path.split(/\.|\[(\d+)\]/).filter(Boolean);
  let acc = object;
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

    acc = acc[keys[i]];
  }

  const pathValues = keys.map((_, idx) => {
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

    unset(pathValues[i - 1], keys[i - 1]);
  }
}

/**
 * A typed version of Object.keys
 */
export function keysOf<TRecord extends Record<string, any>>(record: TRecord): (keyof TRecord)[] {
  return Object.keys(record);
}

// Uses same component provide as its own injections
// Due to changes in https://github.com/vuejs/vue-next/pull/2424
export function injectWithSelf<T>(symbol: InjectionKey<T>, def: T | undefined = undefined): T | undefined {
  const vm = getCurrentInstance() as any;

  return inject(symbol, vm?.provides[symbol as any] || def);
}

export function warn(message: string) {
  console.warn(`[vee-validate]: ${message}`);
}
