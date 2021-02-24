export function getSingleParam<TParam = unknown>(params: [TParam] | Record<string, TParam>, paramName: string) {
  return Array.isArray(params) ? params[0] : params[paramName];
}

export function isEmpty(value: unknown): boolean {
  if (value === null || value === undefined || value === '') {
    return true;
  }

  if (Array.isArray(value) && value.length === 0) {
    return true;
  }

  return false;
}
