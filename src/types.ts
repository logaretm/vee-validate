import Vue, { VNode } from 'vue';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  failedRules: { [x: string]: string };
}

export type VueValidationContext = Vue & {
  $_veeObserver?: VeeObserver;
};

export interface ValidationMessageGenerator {
  (field: string, params?: { [k: string]: any }): string;
}

export type ValidationMessageTemplate = string | ValidationMessageGenerator;

export interface ValidationRuleResult {
  data?: any;
  valid: boolean;
}

export type ValidationRuleFunction = (
  value: any,
  params: any[] | { [k: string]: any }
) => boolean | ValidationRuleResult | Promise<boolean | ValidationRuleResult>;

export interface RuleParamConfig {
  name: string;
  isTarget?: boolean;
  default?: any;
  cast?(value: any): any;
}

export type RuleParamSchema = string | RuleParamConfig;

export interface ValidationRuleSchema {
  validate?: ValidationRuleFunction;
  params?: RuleParamSchema[];
  message?: ValidationMessageGenerator;
  immediate?: boolean;
  computesRequired?: boolean;
}

export type ValidationRule = ValidationRuleFunction | ValidationRuleSchema;

export interface ValidationFlags {
  untouched: boolean;
  touched: boolean;
  dirty: boolean;
  pristine: boolean;
  valid: boolean;
  invalid: boolean;
  validated: boolean;
  pending: boolean;
  required: boolean;
  changed: boolean;
  [x: string]: boolean | undefined;
}

export interface VeeObserver {
  refs: { [k: string]: any };
  subscribe(provider: any, type?: 'provider' | 'observer'): void;
  unsubscribe(provider: any, type?: 'provider' | 'observer'): void;
}

export interface InactiveRefCache {
  errors: string[];
  flags: ValidationFlags;
  failedRules: { [k: string]: string };
}

export type VNodeWithVeeContext = VNode & {
  context: Vue & {
    $_veeObserver?: VeeObserver;
  };
};
