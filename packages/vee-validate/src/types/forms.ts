import { ComputedRef, Ref } from 'vue';
import { MapValuesPathsToRefs, MaybeRef, GenericObject } from './common';
import { FieldValidationMetaInfo } from '../../../shared';
import { Path, PathValue } from './paths';

export interface ValidationResult {
  errors: string[];
  valid: boolean;
}

export interface TypedSchemaError {
  path?: string;
  errors: string[];
}

export interface TypedSchema<TInput = any, TOutput = TInput> {
  __type: 'VVTypedSchema';
  parse(values: TInput): Promise<{ value?: TOutput; errors: TypedSchemaError[] }>;
  cast?(values: Partial<TInput>): TInput;
}

export type YupSchema<TValues = any> = {
  __isYupSchema__: boolean;
  validate(value: any, options: Record<string, any>): Promise<any>;
};

export type Locator = { __locatorRef: string } & ((values: GenericObject) => unknown);

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
  initialValues?: Partial<TValues>;
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
  errors: Partial<Record<Path<TValues>, string | undefined>>;
  touched: Partial<Record<Path<TValues>, boolean>>;
  submitCount: number;
}

export type FormErrors<TValues extends GenericObject> = Partial<Record<Path<TValues>, string | undefined>>;
export type FormErrorBag<TValues extends GenericObject> = Partial<Record<Path<TValues>, string[]>>;

export interface SetFieldValueOptions {
  force: boolean;
}
export interface FormActions<TValues extends GenericObject, TOutput = TValues> {
  setFieldValue<T extends Path<TValues>>(
    field: T,
    value: PathValue<TValues, T>,
    opts?: Partial<SetFieldValueOptions>
  ): void;
  setFieldError(field: Path<TValues>, message: string | string[] | undefined): void;
  setErrors(fields: FormErrors<TValues>): void;
  setValues<T extends Path<TValues>>(fields: Partial<Record<T, TValues[T]>>): void;
  setFieldTouched(field: Path<TValues>, isTouched: boolean): void;
  setTouched(fields: Partial<Record<Path<TValues>, boolean>>): void;
  resetForm(state?: Partial<FormState<TValues>>): void;
  resetField(field: Path<TValues>, state?: Partial<FieldState>): void;
}

export interface FormValidationResult<TValues, TOutput = TValues> {
  valid: boolean;
  results: Partial<Record<Path<TValues>, ValidationResult>>;
  errors: Partial<Record<Path<TValues>, string>>;
  values?: TOutput;
}

export interface SubmissionContext<TValues extends GenericObject = GenericObject> extends FormActions<TValues> {
  evt?: Event;
  controlledValues: Partial<TValues>;
}

export type SubmissionHandler<TValues extends GenericObject = GenericObject, TOutput = TValues, TReturn = unknown> = (
  values: TOutput,
  ctx: SubmissionContext<TValues>
) => TReturn;

export interface InvalidSubmissionContext<TValues extends GenericObject = GenericObject> {
  values: TValues;
  evt?: Event;
  errors: Partial<Record<Path<TValues>, string>>;
  results: Partial<Record<Path<TValues>, ValidationResult>>;
}

export type InvalidSubmissionHandler<TValues extends GenericObject = GenericObject> = (
  ctx: InvalidSubmissionContext<TValues>
) => void;

export type RawFormSchema<TValues> = Record<Path<TValues>, string | GenericValidateFunction | Record<string, any>>;

export type FieldPathLookup<TValues extends Record<string, any> = Record<string, any>> = Partial<
  Record<Path<TValues>, PrivateFieldContext | PrivateFieldContext[]>
>;

type HandleSubmitFactory<TValues extends GenericObject, TOutput = TValues> = <TReturn = unknown>(
  cb: SubmissionHandler<TValues, TOutput, TReturn>,
  onSubmitValidationErrorCb?: InvalidSubmissionHandler<TValues>
) => (e?: Event) => Promise<TReturn | undefined>;

export interface PrivateFormContext<TValues extends GenericObject = GenericObject, TOutput = TValues>
  extends FormActions<TValues> {
  formId: number;
  values: TValues;
  controlledValues: Ref<TValues>;
  fieldsByPath: Ref<FieldPathLookup>;
  fieldArrays: PrivateFieldArrayContext[];
  submitCount: Ref<number>;
  schema?: MaybeRef<RawFormSchema<TValues> | TypedSchema<TValues, TOutput> | YupSchema<TValues> | undefined>;
  errorBag: Ref<FormErrorBag<TValues>>;
  errors: ComputedRef<FormErrors<TValues>>;
  meta: ComputedRef<FormMeta<TValues>>;
  isSubmitting: Ref<boolean>;
  keepValuesOnUnmount: MaybeRef<boolean>;
  validateSchema?: (mode: SchemaValidationMode) => Promise<FormValidationResult<TValues, TOutput>>;
  validate(opts?: Partial<ValidationOptions>): Promise<FormValidationResult<TValues, TOutput>>;
  validateField(field: Path<TValues>): Promise<ValidationResult>;
  setFieldErrorBag(field: string, messages: string | string[]): void;
  stageInitialValue(path: string, value: unknown, updateOriginal?: boolean): void;
  unsetInitialValue(path: string): void;
  register(field: PrivateFieldContext): void;
  unregister(field: PrivateFieldContext): void;
  handleSubmit: HandleSubmitFactory<TValues, TOutput> & { withControlled: HandleSubmitFactory<TValues, TOutput> };
  setFieldInitialValue(path: string, value: unknown): void;
  useFieldModel<TPath extends Path<TValues>>(path: TPath): Ref<PathValue<TValues, TPath>>;
  useFieldModel<TPaths extends readonly [...MaybeRef<Path<TValues>>[]]>(
    paths: TPaths
  ): MapValuesPathsToRefs<TValues, TPaths>;
}

export interface FormContext<TValues extends Record<string, any> = Record<string, any>, TOutput = TValues>
  extends Omit<
    PrivateFormContext<TValues, TOutput>,
    | 'formId'
    | 'register'
    | 'unregister'
    | 'fieldsByPath'
    | 'schema'
    | 'validateSchema'
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
