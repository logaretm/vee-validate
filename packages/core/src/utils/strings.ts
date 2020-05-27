/**
 * Replaces placeholder values in a string with their actual values
 */
export function interpolate(template: string, values: Record<string, any>): string {
  return template.replace(/{([^}]+)}/g, function (_, p): string {
    return p in values ? values[p] : `{${p}}`;
  });
}
