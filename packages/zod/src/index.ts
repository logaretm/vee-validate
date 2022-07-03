import type { ZodObject, ZodType, ZodTypeDef, TypeOf as ZodTypeOf, ZodRawShape, ZodEffects } from 'zod';
import { isIndex } from '../../shared';

/**
 * Transforms a Zod's base type schema to yup's base type schema
 */
export function toFieldValidator<TValue = unknown, TDef extends ZodTypeDef = ZodTypeDef, TInput = TValue>(
  zodSchema: ZodType<TValue, TDef, TInput> | ZodEffects<ZodType<TValue, TDef, TInput>>
): any {
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
  } as any;
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
export function toFormValidator<
  TShape extends ZodRawShape,
  TValues extends Record<string, unknown> = ToBaseTypes<TShape>
>(zodSchema: ZodObject<TShape> | ZodEffects<ZodObject<TShape>>) {
  return {
    async validate(value: TValues) {
      const result = await zodSchema.safeParseAsync(value);
      if (result.success) {
        return true;
      }

      const errors = result.error.issues.map(issue => {
        return { path: joinPath(issue.path), errors: [issue.message] };
      });

      const error: Error & { inner?: AggregatedZodError[] } = new Error(result.error.message);
      error.name = 'ValidationError';
      error.inner = errors;

      throw error;
    },
  } as any;
}

/**
 * Constructs a path with brackets to be compatible with vee-validate path syntax
 */
function joinPath(path: (string | number)[]): string {
  let fullPath = String(path[0]);
  for (let i = 1; i < path.length; i++) {
    if (isIndex(path[i])) {
      fullPath += `[${path[i]}]`;
      continue;
    }

    fullPath += `.${path[i]}`;
  }

  return fullPath;
}
