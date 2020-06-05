export type ValidationRuleFunction = (
  value: any,
  params: any[] | Record<string, any>,
  ctx: FieldContext
) => boolean | string | Promise<boolean | string>;

export interface FieldContext {
  field: string;
  value: any;
  rule: {
    name: string;
    params?: Record<string, any> | any[];
  };
  form: Record<string, any>;
}

export interface ValidationMessageGenerator {
  (ctx: FieldContext): string;
}
