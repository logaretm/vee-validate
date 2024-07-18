import { InterpolateOptions } from '../../shared/types';

/**
 * Replaces placeholder values in a string with their actual values
 */
export function interpolate(template: string, values: Record<string, any>, options: InterpolateOptions): string {
  const { prefix, suffix } = options;

  const regExp = buildRegex(prefix, suffix);

  return template.replace(regExp, function (_, param, placeholder): string {
    if (!param || !values.params) {
      return placeholder in values
        ? values[placeholder]
        : values.params && placeholder in values.params
          ? values.params[placeholder]
          : `${prefix}${placeholder}${suffix}`;
    }

    // Handles extended object params format
    if (!Array.isArray(values.params)) {
      return placeholder in values.params ? values.params[placeholder] : `${prefix}${placeholder}${suffix}`;
    }

    // Extended Params exit in the format of `paramIndex:{paramName}` where the index is optional
    const paramIndex = Number(param.replace(':', ''));

    return paramIndex in values.params ? values.params[paramIndex] : `${param}${prefix}${placeholder}${suffix}`;
  });
}

function escapeRegex(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function buildRegex(prefix: string, suffix: string): RegExp {
  const safePrefix = escapeRegex(prefix);
  const safeSuffix = escapeRegex(suffix);

  return new RegExp(`([0-9]:)?${safePrefix}((?:(?!${safeSuffix}).)+)${safeSuffix}`, 'g');
}
