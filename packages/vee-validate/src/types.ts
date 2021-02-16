import { ComputedRef, Ref, WritableComputedRef } from 'vue';
import { SchemaOf, AnySchema, AnyObjectSchema } from 'yup';
import { FieldContext } from '../../shared';

export interface ValidationResult {
  errors: string[];
  valid: boolean;
}

export type YupValidator = AnySchema | AnyObjectSchema;

export type Locator = { __locatorRef: string } & ((values: Record<string, unknown>) => unknown);

// Extracts explicit keys of an interface without index signature
// https://stackoverflow.com/questions/51465182/typescript-remove-index-signature-using-mapped-types
export type KnownKeys<T> = {
  [K in keyof T]: string extends K ? never : number extends K ? never : K;
} extends { [_ in keyof T]: infer U }
  ? U
  : never;

export type MaybeReactive<T> = Ref<T> | ComputedRef<T> | T;

export interface FieldMeta<TValue> {
  touched: boolean;
  dirty: boolean;
  valid: boolean;
  pending: boolean;
  initialValue?: TValue;
}

export interface FieldState<TValue = unknown> {
  value: TValue;
  touched: boolean;
  errors: string[];
}

export type WritableRef<TValue> = Ref<TValue> | WritableComputedRef<TValue>;

export interface PrivateFieldComposite<TValue = unknown> {
  fid: number;
  idx: number;
  name: MaybeReactive<string>;
  value: WritableRef<TValue>;
  meta: FieldMeta<TValue>;
  errors: Ref<string[]>;
  errorMessage: ComputedRef<string | undefined>;
  type?: string;
  valueProp?: MaybeReactive<TValue>;
  uncheckedValue?: MaybeReactive<TValue>;
  checked?: ComputedRef<boolean>;
  resetField(state?: FieldState<TValue>): void;
  handleReset(state?: FieldState<TValue>): void;
  validate(): Promise<ValidationResult>;
  handleChange(e: Event | unknown): void;
  handleBlur(e?: Event): void;
  handleInput(e?: Event | unknown): void;
  setValidationState(state: ValidationResult): void;
  setTouched(isTouched: boolean): void;
}

export type FieldComposable<TValue = unknown> = Omit<PrivateFieldComposite<TValue>, 'idx' | 'fid'>;

export type SubmitEvent = Event & { target: HTMLFormElement };

export type GenericValidateFunction = (
  value: unknown,
  ctx: FieldContext
) => boolean | string | Promise<boolean | string>;

export interface FormState<TValues> {
  values: TValues;
  errors: Partial<Record<keyof TValues, string | undefined>>;
  touched: Partial<Record<keyof TValues, boolean>>;
  submitCount: number;
}

export type FormErrors<TValues extends Record<string, unknown>> = Partial<Record<keyof TValues, string | undefined>>;
export type FormErrorBag<TValues extends Record<string, unknown>> = Partial<Record<keyof TValues, string[]>>;

export interface SetFieldValueOptions {
  force: boolean;
}
export interface FormActions<TValues extends Record<string, unknown>> {
  setFieldValue<T extends keyof TValues>(field: T, value: TValues[T], opts?: Partial<SetFieldValueOptions>): void;
  setFieldError: (field: keyof TValues, message: string | undefined) => void;
  setErrors: (fields: FormErrors<TValues>) => void;
  setValues<T extends keyof TValues>(fields: Partial<Record<T, TValues[T]>>): void;
  setFieldTouched: (field: keyof TValues, isTouched: boolean) => void;
  setTouched: (fields: Partial<Record<keyof TValues, boolean>>) => void;
  resetForm: (state?: Partial<FormState<TValues>>) => void;
}

export interface FormValidationResult<TValues> {
  errors: Partial<Record<keyof TValues, string>>;
  valid: boolean;
}

export interface SubmissionContext<TValues extends Record<string, unknown> = Record<string, unknown>>
  extends FormActions<TValues> {
  evt: SubmitEvent;
}

export type SubmissionHandler<TValues extends Record<string, unknown> = Record<string, unknown>> = (
  values: TValues,
  ctx: SubmissionContext<TValues>
) => unknown;

export interface FormContext<TValues extends Record<string, any> = Record<string, any>> extends FormActions<TValues> {
  register(field: PrivateFieldComposite): void;
  unregister(field: PrivateFieldComposite): void;
  values: TValues;
  fields: ComputedRef<Record<keyof TValues, PrivateFieldComposite | PrivateFieldComposite[]>>;
  submitCount: Ref<number>;
  schema?: Record<keyof TValues, GenericValidateFunction | string | Record<string, any>> | SchemaOf<TValues>;
  validateSchema?: (shouldMutate?: boolean) => Promise<Record<keyof TValues, ValidationResult>>;
  validate(): Promise<FormValidationResult<TValues>>;
  validateField(field: keyof TValues): Promise<ValidationResult>;
  errorBag: Ref<FormErrorBag<TValues>>;
  setFieldErrorBag(field: string, messages: string[]): void;
  meta: ComputedRef<{
    dirty: boolean;
    touched: boolean;
    valid: boolean;
    pending: boolean;
    initialValues: TValues;
  }>;
  isSubmitting: Ref<boolean>;
  handleSubmit(cb: SubmissionHandler<TValues>): (e?: SubmitEvent) => Promise<void>;
}

export interface PublicFormContext<TValues extends Record<string, any> = Record<string, any>>
  extends Omit<
    FormContext<TValues>,
    'register' | 'unregister' | 'fields' | 'schema' | 'validateSchema' | 'errorBag' | 'setFieldErrorBag'
  > {
  errors: ComputedRef<FormErrors<TValues>>;
  handleReset: () => void;
  submitForm: (e?: unknown) => Promise<void>;
}
