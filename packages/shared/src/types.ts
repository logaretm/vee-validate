export interface FieldContext {
  field: string;
  value: any;
  form: Record<string, any>;
  rule: {
    name: string;
    params?: Record<string, any> | any[];
  };
}

export type ValidationRuleFunction = (
  value: any,
  params: any[] | Record<string, any>,
  ctx: FieldContext
) => boolean | string | Promise<boolean | string>;

export type ValidationMessageGenerator = (ctx: FieldContext) => string;
