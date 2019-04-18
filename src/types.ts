export interface ValidationResult {
  valid: boolean;
  errors: string[];
  failedRules: { [x: string]: string };
}

export interface ValidationMessageGenerator {
  (field: string, params: any[], data: any): string;
}

export interface ValidationRuleResult {
  data?: any;
  valid: boolean;
}

export type ValidationRuleFunction =
(value: any, params: any[] | { [k: string]: any }) => boolean | ValidationRuleResult | Promise<boolean | ValidationRuleResult>;

export type ValidationRuleSchema = {
  validate: ValidationRuleFunction;
  options?: any;
  paramNames?: string[];
  getMessage?: ValidationMessageGenerator;
}

export type ValidationRule = ValidationRuleFunction | ValidationRuleSchema;
