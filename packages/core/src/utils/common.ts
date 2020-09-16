import { isEmptyContainer, isIndex, isNotNestedPath } from './assertions';

export function genFieldErrorId(fieldName: string): string {
  return `v_${fieldName}_error`;
}

function cleanupNonNestedPath(path: string) {
  if (isNotNestedPath(path)) {
    return path.replace(/\[|\]/gi, '');
  }

  return path;
}

/**
 * Gets a nested property value from an object
 */
export function getFromPath(object: Record<string, any>, path: string): any {
  if (isNotNestedPath(path)) {
    return object[cleanupNonNestedPath(path)];
  }

  return path.split('.').reduce((acc, propKey) => {
    if (acc && acc[propKey]) {
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

  const keys = path.split('.');
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

/**
 * Removes a nested property from object
 */
export function unsetPath(object: Record<string, any>, path: string, { keepContainer = false } = {}): void {
  if (isNotNestedPath(path)) {
    delete object[cleanupNonNestedPath(path)];
    return;
  }

  const keys = path.split('.');
  let acc = object;
  for (let i = 0; i < keys.length; i++) {
    // Last key, unset it
    if (i === keys.length - 1) {
      if (Array.isArray(acc) && isIndex(keys[i])) {
        acc.splice(Number(keys[i]), 1);
        break;
      }

      delete acc[keys[i]];
      break;
    }

    // Key does not exist, exit
    if (!(keys[i] in acc)) {
      break;
    }

    acc = acc[keys[i]];
  }

  if (keepContainer) {
    return;
  }

  acc = object;
  for (let i = 0; i < keys.length; i++) {
    if (acc && isEmptyContainer(acc[keys[i]])) {
      delete acc[keys[i]];
      return;
    }

    acc = acc[keys[i]];
  }
}
