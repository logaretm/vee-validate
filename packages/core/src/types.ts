import { ComputedRef, Ref } from 'vue';
import { RuleParamSchema, ValidationRuleFunction } from '@vee-validate/shared';

export { RuleParamSchema, ValidationRuleFunction };

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  failedRules: Record<string, string>;
  regenerateMap?: Record<string, () => string>;
}

export type Locator = { __locatorRef: string } & Function;

export interface ValidationMessageGenerator {
  (field: string, params?: Record<string, any>): string;
}

export type ValidationMessageTemplate = string | ValidationMessageGenerator;

export interface RuleParamConfig {
  name: string;
  isTarget?: boolean;
  default?: any;
  cast?(value: any): any;
}
export interface ValidationRuleSchema {
  validate?: ValidationRuleFunction;
  params?: RuleParamSchema[];
  message?: ValidationMessageTemplate;
  lazy?: boolean;
  computesRequired?: boolean;
  castValue?(value: any): any;
}

export type ValidationRule = ValidationRuleFunction | ValidationRuleSchema;

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

export interface VeeObserver {
  refs: Record<string, any>;
  observe(provider: any, type?: 'provider' | 'observer'): void;
  unobserve(id: string, type?: 'provider' | 'observer'): void;
}

export interface InactiveRefCache {
  id: string;
  errors: string[];
  flags: ValidationFlags;
  failedRules: Record<string, string>;
}

export type Flag =
  | 'untouched'
  | 'touched'
  | 'dirty'
  | 'pristine'
  | 'valid'
  | 'invalid'
  | 'passed'
  | 'failed'
  | 'validated'
  | 'pending'
  | 'required'
  | 'changed';

export interface FieldComposite extends Record<Flag, Ref<boolean>> {
  validate(): Promise<ValidationResult>;
  reset(): void;
  handleChange(e?: any): void;
  onBlur(e?: any): void;
  value: Ref<any>;
  failedRules: Ref<Record<string, string>>;
  errors: Ref<string[]>;
  errorMessage: Ref<string | undefined>;
}

export interface FormController {
  register(field: any): void;
  values: ComputedRef<Record<string, any>>;
  names: ComputedRef<Record<string, string>>;
  fields: any;
}

export type MaybeReactive<T> = Ref<T> | T;

export type SubmissionHandler = (values: Record<string, any>) => any;
