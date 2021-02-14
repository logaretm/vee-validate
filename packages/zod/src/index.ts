import type { ZodObject, ZodType, ZodTypeDef, TypeOf as ZodTypeOf, ZodRawShape } from 'zod';
import type { BaseSchema, SchemaOf } from 'yup';

/**
 * Transforms a Zod's base type schema to yup's base type schema
 */
export function toFieldValidator<TValue = any, TDef extends ZodTypeDef = ZodTypeDef, TInput = TValue>(
  zodSchema: ZodType<TValue, TDef, TInput>
): BaseSchema<TValue> {
  return {
    async validate(value: TValue) {
      const result = await zodSchema.safeParseAsync(value);
      if (result.success) {
        return true;
      }

      const error: Error & { errors?: string[] } = new Error(result.error.message);
      error.name = 'ValidationError';
      error.errors = result.error.formErrors.formErrors;

      throw error;
    },
  } as BaseSchema<TValue>;
}

interface AggregatedZodError {
  path: string;
  errors: string[];
}

type ToBaseTypes<TShape extends ZodRawShape> = {
  [P in keyof TShape]: ZodTypeOf<TShape[P]>;
};

/**
 * Transforms a Zod object schema to Yup's schema
 */
export function toFormValidator<TShape extends ZodRawShape, TValues extends Record<string, any> = ToBaseTypes<TShape>>(
  zodSchema: ZodObject<TShape>
): SchemaOf<TValues> {
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
  } as SchemaOf<TValues>;
}
