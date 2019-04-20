import Vue from "vue";

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

// maps known keys of a given type.
// https://github.com/Microsoft/TypeScript/issues/12215#issuecomment-414782407
type KnownKeys<T> = {
  [K in keyof T]: string extends K ? never : number extends K ? never : K
} extends { [_ in keyof T]: infer U } ? U : never;

interface ObserverSlotData extends Pick<ValidationFlags, KnownKeys<ValidationFlags>> {
  errors: string[];
}

/**
 * The `ValidationObserver` is a convenient component that uses the `scoped slots` feature
 * to communicate the current state of your inputs as a whole.
 * Note that this component is renderless.
 */
export interface ValidationObserver extends Vue {
  validate(): Promise<boolean>;
  reset(): void;
  observers: ValidationObserver[];
  refs: { [x: string]: ValidationProvider };
  ctx: ObserverSlotData;
};

/**
 * The `ValidationProvider` component is a regular component
 * that wraps your inputs and provides validation state using `scoped slots`.
 * Note that this component is renderless.
 */
export interface ValidationProvider extends Vue {
  messages: string[];
  flags: ValidationFlags;
  applyResult(result: ValidationResult): void;
  validate(value: any): Promise<ValidationResult>;
  reset(): void;
  validateSilent(): Promise<ValidationResult>;
  syncValue(value: any): void;
  setFlags(value: { [x: string]: boolean }): void;
}
