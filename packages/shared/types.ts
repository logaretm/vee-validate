export interface FieldValidationMetaInfo {
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
  ctx: FieldValidationMetaInfo
) => boolean | string | Promise<boolean | string>;

export type SimpleValidationRuleFunction<TValue = unknown, TParams = unknown[] | Record<string, unknown>> = (
  value: TValue,
  params: TParams
) => boolean | string | Promise<boolean | string>;

export type ValidationMessageGenerator = (ctx: FieldValidationMetaInfo) => string;
