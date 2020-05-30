import { ObjectSchema, Schema } from 'yup';

export function wrap<T>(rules: Schema<T>) {
  return async (value: any) => {
    try {
      await rules.validate(value);

      return true;
    } catch (err) {
      return err.message;
    }
  };
}

export function wrapSchema<T extends Record<string, unknown> | undefined>(schema: ObjectSchema<T>) {
  return Object.keys(schema.fields).reduce((acc, field) => {
    acc[field] = wrap((schema as any).fields[field]);

    return acc;
  }, {} as Record<string, ReturnType<typeof wrap>>);
}
