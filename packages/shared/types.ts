export interface FieldContext {
  field: string;
  value: unknown;
  form: Record<string, unknown>;
  rule?: {
    name: string;
    params?: Record<string, unknown> | unknown[];
  };
}

export type ValidationRuleFunction<TValue = unknown, TParams = unknown[] | Record<string, unknown>> = (
  value: TValue,
  params: TParams,
  ctx: FieldContext
) => boolean | string | Promise<boolean | string>;

export type SimpleValidationRuleFunction<TValue = unknown, TParams = unknown[] | Record<string, unknown>> = (
  value: TValue,
  params: TParams
) => boolean | string | Promise<boolean | string>;

export type ValidationMessageGenerator = (ctx: FieldContext) => string;
