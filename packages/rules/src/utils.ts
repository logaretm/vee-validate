export function getSingleParam<TParam = unknown>(params: [TParam] | Record<string, TParam>, paramName: string) {
  return Array.isArray(params) ? params[0] : params[paramName];
}
