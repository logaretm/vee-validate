export function genFieldErrorId(fieldName: string): string {
  return `v_${fieldName}_error`;
}

/**
 * Gets a nested property value from an object
 */
export function getFromPath(object: Record<string, any>, path: string): any {
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
  const keys = path.split('.');
  let acc = object;
  for (let i = 0; i < keys.length; i++) {
    // Last key, set it
    if (i === keys.length - 1) {
      acc[keys[i]] = value;
      break;
    }

    // Key does not exist, create a container for it
    if (!(keys[i] in acc)) {
      acc[keys[i]] = {};
    }

    acc = acc[keys[i]];
  }
}
