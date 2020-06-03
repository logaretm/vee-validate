export function getSingleParam(params: any[] | Record<string, any> | undefined, paramName: string) {
  if (!params) {
    return undefined;
  }

  return Array.isArray(params) ? params[0] : params[paramName];
}
