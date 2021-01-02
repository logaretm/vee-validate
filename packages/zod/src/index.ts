import type { ZodObject, ZodTypeAny } from 'zod';

export function toFieldValidator(zodSchema: ZodTypeAny) {
  return {
    async validate(value: any) {
      const result = await zodSchema.safeParseAsync(value);
      if (result.success) {
        return true;
      }

      const error: Error & { errors?: string[] } = new Error(result.error.message);
      error.name = 'ValidationError';
      error.errors = result.error.formErrors.formErrors;

      throw error;
    },
  };
}

interface AggregatedZodError {
  path: string;
  errors: string[];
}

export function toSchemaValidator<TValues extends Record<string, any>>(zodSchema: ZodObject<TValues>) {
  return {
    async validate(value: TValues) {
      const result = await zodSchema.safeParseAsync(value);
      if (result.success) {
        return true;
      }

      const errorsByField = result.error.formErrors.fieldErrors;

      const errors = Object.keys(errorsByField).reduce((acc, path) => {
        acc.push({ path, errors: errorsByField[path] });

        return acc;
      }, [] as AggregatedZodError[]);

      const error: Error & { inner?: AggregatedZodError[] } = new Error(result.error.message);
      error.name = 'ValidationError';
      error.inner = errors;

      throw error;
    },
  };
}
