/**
 * Replaces placeholder values in a string with their actual values
 */
export function interpolate(template: string, values: Record<string, any>): string {
  return template.replace(/(\d:)?{([^}]+)}/g, function (_, param, placeholder): string {
    if (!param || !values.params) {
      return placeholder in values
        ? values[placeholder]
        : values.params && placeholder in values.params
        ? values.params[placeholder]
        : `{${placeholder}}`;
    }

    // Handles extended object params format
    if (!Array.isArray(values.params)) {
      return placeholder in values.params ? values.params[placeholder] : `{${placeholder}}`;
    }

    // Extended Params exit in the format of `paramIndex:{paramName}` where the index is optional
    const paramIndex = Number(param.replace(':', ''));

    return paramIndex in values.params ? values.params[paramIndex] : `${param}{${placeholder}}`;
  });
}
