export interface RuleParamConfig {
  name: string;
  isTarget?: boolean;
  default?: any;
  cast?(value: any): any;
}

export type RuleParamSchema = string | RuleParamConfig;

export type ValidationRuleFunction = (
  value: any,
  params: any[] | Record<string, any>
) => boolean | string | ValidationRuleResult | Promise<boolean | string | ValidationRuleResult>;

export interface ValidationRuleResult {
  data?: Record<string, any>;
  valid: boolean;
  required?: boolean;
}
