import Vue from 'vue';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  failedRules: { [x: string]: string };
}

export type VueValidationContext = Vue & {
  $_veeObserver?: VeeObserver;
};

export interface ValidationMessageGenerator {
  (field: string, params: any[], data: any): string;
}

export interface ValidationRuleResult {
  data?: any;
  valid: boolean;
}

export type ValidationRuleFunction = (
  value: any,
  params: any[] | { [k: string]: any }
) => boolean | ValidationRuleResult | Promise<boolean | ValidationRuleResult>;

export type ValidationRuleSchema = {
  validate: ValidationRuleFunction;
  options?: any;
  paramNames?: string[];
  getMessage?: ValidationMessageGenerator;
};

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
type KnownKeys<T> = { [K in keyof T]: string extends K ? never : number extends K ? never : K } extends {
  [_ in keyof T]: infer U
}
  ? U
  : never;

interface ObserverSlotData extends Pick<ValidationFlags, KnownKeys<ValidationFlags>> {
  errors: string[];
}

/**
 * The `ValidationObserver` is a convenient component that uses the `scoped slots` feature
 * to communicate the current state of your inputs as a whole.
 */
export interface ValidationObserverInstance extends Vue {
  /**
   * Trigger validation across all child components validation state, updates their validation state.
   * Can pass a silent flag to only report the current state of the observed children without triggering state change.
   */
  validate(opts?: { silent: boolean }): Promise<boolean>;

  /**
   * Reset all observed components validation state.
   */
  reset(): void;

  /**
   * Holds reference to the observed child observer components.
   */
  observers: ValidationObserverInstance[];

  /**
   * Contains an id, provider-instances pairs of the observed children.
   */
  refs: { [x: string]: ValidationProviderInstance };

  /**
   * Validation state object representing the combined state of the observed children.
   */
  ctx: ObserverSlotData;
}

/**
 * The `ValidationProvider` component is a regular component
 * that wraps your inputs and provides validation state using `scoped slots`.
 */
export interface ValidationProviderInstance extends Vue {
  messages: string[];
  flags: ValidationFlags;

  /**
   * Updates the validation state with the given result.
   */
  applyResult(result: ValidationResult): void;

  /**
   * Triggers a validation, updates messages and flags.
   */
  validate(value: any): Promise<ValidationResult>;

  /**
   * Resets validation state, clears error messages.
   */
  reset(): void;

  /**
   * Triggers a validation without setting flags or updating messages.
   */
  validateSilent(): Promise<ValidationResult>;

  /**
   * Forces the provider value to the given value without triggering validation.
   */
  syncValue(value: any): void;

  /**
   * Sets the current flags for the provider instance.
   */
  setFlags(value: Partial<ValidationFlags>): void;
}

export interface MappedFieldState {
  errors: string[];
  flags: ValidationFlags;
  classes: { [k: string]: boolean };
}

export interface MappedValidationState {
  fields: { [k: string]: MappedFieldState };
  for: (fieldNameOrVid: string) => MappedFieldState;
}

export interface MapStateOptions {
  inherit: boolean;
}

export interface VeeObserver {
  refs: { [k: string]: any };
  subscribe(provider: any): void;
  unsubscribe(provider: any): void;
}
