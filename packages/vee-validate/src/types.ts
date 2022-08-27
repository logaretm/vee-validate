import { ComputedRef, Ref } from 'vue';
import { FieldValidationMetaInfo } from '../../shared';

export type GenericFormValues = Record<string, unknown>;

export interface ValidationResult {
  errors: string[];
  valid: boolean;
}

export type YupValidator<TValue = any> = { validate(value: TValue, options: Record<string, any>): Promise<TValue> };

export interface YupValidationError extends Error {
  value: any;
  path?: string;
  errors: string[];
  inner: YupValidationError[];
}

export type Locator = { __locatorRef: string } & ((values: GenericFormValues) => unknown);

export type MaybeRef<T> = Ref<T> | T;

export type MaybeArray<T> = T | T[];

export interface FieldMeta<TValue> {
  touched: boolean;
  dirty: boolean;
  valid: boolean;
  validated: boolean;
  pending: boolean;
  initialValue?: TValue;
}

export interface FormMeta<TValues extends Record<string, any>> {
  touched: boolean;
  dirty: boolean;
  valid: boolean;
  validated: boolean;
  pending: boolean;
  initialValues?: TValues;
}

export interface FieldState<TValue = unknown> {
  value: TValue;
  touched: boolean;
  errors: string[];
}

/**
 * validated-only: only mutate the previously validated fields
 * silent: do not mutate any field
 * force: validate all fields and mutate their state
 */
export type SchemaValidationMode = 'validated-only' | 'silent' | 'force';

export interface ValidationOptions {
  mode: SchemaValidationMode;
}

export interface FieldEntry<TValue = unknown> {
  value: TValue;
  key: string | number;
  isFirst: boolean;
  isLast: boolean;
}

export interface FieldArrayContext<TValue = unknown> {
  fields: Ref<FieldEntry<TValue>[]>;
  remove(idx: number): void;
  replace(newArray: TValue[]): void;
  update(idx: number, value: TValue): void;
  push(value: TValue): void;
  swap(indexA: number, indexB: number): void;
  insert(idx: number, value: TValue): void;
  prepend(value: TValue): void;
  move(oldIdx: number, newIdx: number): void;
}

export interface PrivateFieldArrayContext<TValue = unknown> extends FieldArrayContext<TValue> {
  reset(): void;
  path: MaybeRef<string>;
}

export interface PrivateFieldContext<TValue = unknown> {
  id: number;
  name: MaybeRef<string>;
  value: Ref<TValue>;
  meta: FieldMeta<TValue>;
  errors: Ref<string[]>;
  errorMessage: Ref<string | undefined>;
  label?: MaybeRef<string | undefined>;
  type?: string;
  bails?: boolean;
  keepValueOnUnmount?: MaybeRef<boolean | undefined>;
  checkedValue?: MaybeRef<TValue>;
  uncheckedValue?: MaybeRef<TValue>;
  checked?: Ref<boolean>;
  resetField(state?: Partial<FieldState<TValue>>): void;
  handleReset(): void;
  validate(opts?: Partial<ValidationOptions>): Promise<ValidationResult>;
  handleChange(e: Event | unknown, shouldValidate?: boolean): void;
  handleBlur(e?: Event): void;
  setState(state: Partial<FieldState<TValue>>): void;
  setTouched(isTouched: boolean): void;
  setErrors(message: string | string[]): void;
  setValue(value: TValue): void;
}

export type FieldContext<TValue = unknown> = Omit<PrivateFieldContext<TValue>, 'id' | 'instances'>;

export type GenericValidateFunction<TValue = unknown> = (
  value: TValue,
  ctx: FieldValidationMetaInfo
) => boolean | string | Promise<boolean | string>;

export interface FormState<TValues> {
  values: TValues;
  errors: Partial<Record<keyof TValues, string | undefined>>;
  touched: Partial<Record<keyof TValues, boolean>>;
  submitCount: number;
}

export type FormErrors<TValues extends GenericFormValues> = Partial<Record<keyof TValues, string | undefined>>;
export type FormErrorBag<TValues extends GenericFormValues> = Partial<Record<keyof TValues, string[]>>;

export interface SetFieldValueOptions {
  force: boolean;
}
export interface FormActions<TValues extends GenericFormValues> {
  setFieldValue<T extends keyof TValues>(field: T, value: TValues[T], opts?: Partial<SetFieldValueOptions>): void;
  setFieldError: (field: keyof TValues, message: string | string[] | undefined) => void;
  setErrors: (fields: FormErrors<TValues>) => void;
  setValues<T extends keyof TValues>(fields: Partial<Record<T, TValues[T]>>): void;
  setFieldTouched: (field: keyof TValues, isTouched: boolean) => void;
  setTouched: (fields: Partial<Record<keyof TValues, boolean>>) => void;
  resetForm: (state?: Partial<FormState<TValues>>) => void;
}

export interface FormValidationResult<TValues> {
  valid: boolean;
  results: Partial<Record<keyof TValues, ValidationResult>>;
  errors: Partial<Record<keyof TValues, string>>;
}

export interface SubmissionContext<TValues extends GenericFormValues = GenericFormValues> extends FormActions<TValues> {
  evt?: Event;
}

export type SubmissionHandler<TValues extends GenericFormValues = GenericFormValues, TReturn = unknown> = (
  values: TValues,
  ctx: SubmissionContext<TValues>
) => TReturn;

export interface InvalidSubmissionContext<TValues extends GenericFormValues = GenericFormValues> {
  values: TValues;
  evt?: Event;
  errors: Partial<Record<keyof TValues, string>>;
  results: Partial<Record<keyof TValues, ValidationResult>>;
}

export type InvalidSubmissionHandler<TValues extends GenericFormValues = GenericFormValues> = (
  ctx: InvalidSubmissionContext<TValues>
) => void;

export type RawFormSchema<TValues> = Record<keyof TValues, string | GenericValidateFunction | Record<string, any>>;

export type FieldPathLookup<TValues extends Record<string, any> = Record<string, any>> = Partial<
  Record<keyof TValues, PrivateFieldContext | PrivateFieldContext[]>
>;

export type MapValues<T, TValues extends Record<string, any>> = {
  [K in keyof T]: T[K] extends MaybeRef<infer TKey>
    ? TKey extends keyof TValues
      ? Ref<TValues[TKey]>
      : Ref<unknown>
    : Ref<unknown>;
};

export interface PrivateFormContext<TValues extends Record<string, any> = Record<string, any>>
  extends FormActions<TValues> {
  formId: number;
  values: TValues;
  fieldsByPath: Ref<FieldPathLookup>;
  fieldArrays: PrivateFieldArrayContext[];
  submitCount: Ref<number>;
  schema?: MaybeRef<RawFormSchema<TValues> | YupValidator<TValues> | undefined>;
  errorBag: Ref<FormErrorBag<TValues>>;
  errors: ComputedRef<FormErrors<TValues>>;
  meta: ComputedRef<FormMeta<TValues>>;
  isSubmitting: Ref<boolean>;
  keepValuesOnUnmount: MaybeRef<boolean>;
  validateSchema?: (mode: SchemaValidationMode) => Promise<FormValidationResult<TValues>>;
  validate(opts?: Partial<ValidationOptions>): Promise<FormValidationResult<TValues>>;
  validateField(field: keyof TValues): Promise<ValidationResult>;
  setFieldErrorBag(field: string, messages: string | string[]): void;
  stageInitialValue(path: string, value: unknown, updateOriginal?: boolean): void;
  unsetInitialValue(path: string): void;
  register(field: PrivateFieldContext): void;
  unregister(field: PrivateFieldContext): void;
  handleSubmit<TReturn = unknown>(
    cb: SubmissionHandler<TValues, TReturn>,
    onSubmitValidationErrorCb?: InvalidSubmissionHandler<TValues>
  ): (e?: Event) => Promise<TReturn | undefined>;
  setFieldInitialValue(path: string, value: unknown): void;
  useFieldModel<TPath extends keyof TValues>(path: MaybeRef<TPath>): Ref<TValues[TPath]>;
  useFieldModel<TPath extends keyof TValues>(paths: [...MaybeRef<TPath>[]]): MapValues<typeof paths, TValues>;
}

export interface FormContext<TValues extends Record<string, any> = Record<string, any>>
  extends Omit<
    PrivateFormContext<TValues>,
    | 'formId'
    | 'register'
    | 'unregister'
    | 'fieldsByPath'
    | 'schema'
    | 'validateSchema'
    | 'errorBag'
    | 'setFieldErrorBag'
    | 'stageInitialValue'
    | 'setFieldInitialValue'
    | 'unsetInitialValue'
    | 'fieldArrays'
    | 'keepValuesOnUnmount'
  > {
  handleReset: () => void;
  submitForm: (e?: unknown) => Promise<void>;
}

export interface DevtoolsPluginFieldState {
  name: string;
  value: any;
  initialValue: any;
  errors: string[];
  meta: FieldMeta<any>;
}

export interface DevtoolsPluginFormState {
  meta: FormMeta<Record<string, any>>;
  errors: FormErrors<Record<string, any>>;
  values: Record<string, any>;
  isSubmitting: boolean;
  submitCount: number;
}
