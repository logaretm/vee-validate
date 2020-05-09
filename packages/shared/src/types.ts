export type ValidationRuleFunction = (
  value: any,
  params: any[] | Record<string, any>
) => boolean | string | ValidationRuleResult | Promise<boolean | string | ValidationRuleResult>;

export interface ValidationRuleResult {
  valid: boolean;
  required?: boolean;
}
