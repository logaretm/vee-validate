import { RawFormSchema, validateObject, validate, GenericObject } from 'vee-validate';
import { StandardSchemaV1 } from '@standard-schema/spec';

export function toTypedSchema<TInput, TOutput = TInput>(
  rawSchema: RawFormSchema<TInput> | string,
): StandardSchemaV1<TInput, TOutput> {
  const schema: StandardSchemaV1<TInput, TOutput> = {
    '~standard': {
      vendor: 'vee-validate',
      version: 1,
      async validate(values: unknown) {
        // single field
        if (typeof rawSchema === 'string') {
          const result = await validate(values, rawSchema);

          return {
            issues: result.errors.map(error => ({
              path: [],
              message: error,
            })),
          };
        }

        const result = await validateObject(rawSchema, values as GenericObject | undefined);
        const issues: StandardSchemaV1.Issue[] = [];
        if (result.valid) {
          return {
            value: result.values as TOutput,
          };
        }

        for (const [path, error] of Object.entries(result.errors)) {
          if (error) {
            issues.push({
              path: [path],
              message: error,
            });
          }
        }

        return {
          issues,
        };
      },
    },
  };

  return schema;
}
