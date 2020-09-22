/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable camelcase */
import Vue, { VNode } from 'vue';
import { ValidationProvider } from './components/Provider';

export type ProviderInstance = InstanceType<typeof ValidationProvider>;

export interface VeeObserver {
  refs: Record<string, ProviderInstance>;
  observe(provider: any, type?: 'provider' | 'observer'): void;
  unobserve(id: string, type?: 'provider' | 'observer'): void;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  failedRules: Record<string, string>;
  regenerateMap?: Record<string, () => string>;
}

export type VueValidationContext = Vue & {
  $_veeObserver?: VeeObserver;
};

export type Locator = { __locatorRef: string } & Function;

export interface ValidationMessageGenerator {
  (field: string, params: Record<string, any>): string;
}

export type ValidationMessageTemplate = string | ValidationMessageGenerator;

export interface ValidationRuleResult {
  data?: Record<string, any>;
  valid: boolean;
  required?: boolean;
}

export type ValidationRuleFunction = (
  value: any,
  params: any[] | Record<string, any>
) => boolean | string | ValidationRuleResult | Promise<boolean | string | ValidationRuleResult>;

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
  message?: ValidationMessageTemplate;
  lazy?: boolean;
  computesRequired?: boolean;
  castValue?(value: any): any;
}

export type ValidationRule = ValidationRuleFunction | ValidationRuleSchema;

export type StringOrNumber = string | number;

// Extracts explicit keys of an interface without index signature
// https://stackoverflow.com/questions/51465182/typescript-remove-index-signature-using-mapped-types
export type KnownKeys<T> = {
  [K in keyof T]: string extends K ? never : number extends K ? never : K;
} extends { [_ in keyof T]: infer U }
  ? U
  : never;

export interface ValidationFlags {
  untouched: boolean;
  touched: boolean;
  dirty: boolean;
  pristine: boolean;
  valid: boolean;
  invalid: boolean;
  passed: boolean;
  failed: boolean;
  validated: boolean;
  pending: boolean;
  required: boolean;
  changed: boolean;
  [x: string]: boolean | undefined;
}

export interface InactiveRefCache {
  id: string;
  errors: string[];
  flags: ValidationFlags;
  failedRules: Record<string, string>;
}

export type VNodeWithVeeContext = VNode & {
  context: Vue & {
    $_veeObserver?: VeeObserver;
  };
};
