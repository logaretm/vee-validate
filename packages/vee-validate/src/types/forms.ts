import { ComputedRef, DeepReadonly, Ref, MaybeRef, MaybeRefOrGetter } from 'vue';
import { MapValuesPathsToRefs, GenericObject } from './common';
import { FieldValidationMetaInfo } from '../../../shared';
import { Path, PathValue } from './paths';
import { PartialDeep } from 'type-fest';

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
  validate(value: any, options: GenericObject): Promise<any>;
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

export interface FormMeta<TValues extends GenericObject> {
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

export type InputType = 'checkbox' | 'radio' | 'default';

/**
 * validated-only: only mutate the previously validated fields
 * silent: do not mutate any field
 * force: validate all fields and mutate their state
 */
export type SchemaValidationMode = 'validated-only' | 'silent' | 'force';

export interface ValidationOptions {
  mode: SchemaValidationMode;
}

export type FieldValidator = (opts?: Partial<ValidationOptions>) => Promise<ValidationResult>;

export interface PathStateConfig {
  bails: boolean;
  label: MaybeRef<string | undefined>;
  type: InputType;
  validate: FieldValidator;
}

export interface PathState<TValue = unknown> {
  id: number | number[];
  path: string;
  touched: boolean;
  dirty: boolean;
  valid: boolean;
  validated: boolean;
  pending: boolean;
  initialValue: TValue | undefined;
  value: TValue | undefined;
  errors: string[];
  bails: boolean;
  label: string | undefined;
  type: InputType;
  multiple: boolean;
  fieldsCount: number;
  __flags: {
    pendingUnmount: Record<string, boolean>;
  };
  validate?: FieldValidator;
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
  validate: FieldValidator;
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
  values: PartialDeep<TValues>;
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
  setValues(fields: PartialDeep<TValues>): void;
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

export type RawFormSchema<TValues> = Record<Path<TValues>, string | GenericValidateFunction | GenericObject>;

export type FieldPathLookup<TValues extends GenericObject = GenericObject> = Partial<
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
  initialValues: Ref<Partial<TValues>>;
  controlledValues: Ref<TValues>;
  fieldArrays: PrivateFieldArrayContext[];
  submitCount: Ref<number>;
  schema?: MaybeRef<RawFormSchema<TValues> | TypedSchema<TValues, TOutput> | YupSchema<TValues> | undefined>;
  errorBag: Ref<FormErrorBag<TValues>>;
  errors: ComputedRef<FormErrors<TValues>>;
  meta: ComputedRef<FormMeta<TValues>>;
  isSubmitting: Ref<boolean>;
  isValidating: Ref<boolean>;
  keepValuesOnUnmount: MaybeRef<boolean>;
  validateSchema?: (mode: SchemaValidationMode) => Promise<FormValidationResult<TValues, TOutput>>;
  validate(opts?: Partial<ValidationOptions>): Promise<FormValidationResult<TValues, TOutput>>;
  validateField(field: Path<TValues>): Promise<ValidationResult>;
  stageInitialValue(path: string, value: unknown, updateOriginal?: boolean): void;
  unsetInitialValue(path: string): void;
  handleSubmit: HandleSubmitFactory<TValues, TOutput> & { withControlled: HandleSubmitFactory<TValues, TOutput> };
  setFieldInitialValue(path: string, value: unknown): void;
  useFieldModel<TPath extends Path<TValues>>(path: TPath): Ref<PathValue<TValues, TPath>>;
  useFieldModel<TPaths extends readonly [...MaybeRef<Path<TValues>>[]]>(
    paths: TPaths
  ): MapValuesPathsToRefs<TValues, TPaths>;
  createPathState<TPath extends Path<TValues>>(
    path: MaybeRef<TPath>,
    config?: Partial<PathStateConfig>
  ): PathState<PathValue<TValues, TPath>>;
  getPathState<TPath extends Path<TValues>>(path: TPath): PathState<PathValue<TValues, TPath>> | undefined;
  getAllPathStates(): PathState[];
  removePathState<TPath extends Path<TValues>>(path: TPath, id: number): void;
  unsetPathValue<TPath extends Path<TValues>>(path: TPath): void;
  markForUnmount(path: string): void;
}

export interface BaseComponentBinds<TValue = unknown> {
  modelValue: TValue | undefined;
  'onUpdate:modelValue': (value: TValue) => void;
  onBlur: () => void;
}

export type PublicPathState<TValue = unknown> = Omit<
  PathState<TValue>,
  'bails' | 'label' | 'multiple' | 'fieldsCount' | 'validate' | 'id' | 'type' | '__flags'
>;

export interface ComponentBindsConfig<TValue = unknown, TExtraProps extends GenericObject = GenericObject> {
  mapProps: (state: PublicPathState<TValue>) => TExtraProps;
  validateOnBlur: boolean;
  validateOnModelUpdate: boolean;
}

export type LazyComponentBindsConfig<TValue = unknown, TExtraProps extends GenericObject = GenericObject> = (
  state: PublicPathState<TValue>
) => Partial<{
  props: TExtraProps;
  validateOnBlur: boolean;
  validateOnModelUpdate: boolean;
}>;

export interface BaseInputBinds<TValue = unknown> {
  value: TValue | undefined;
  onBlur: (e: Event) => void;
  onChange: (e: Event) => void;
  onInput: (e: Event) => void;
}

export interface InputBindsConfig<TValue = unknown, TExtraProps extends GenericObject = GenericObject> {
  mapAttrs: (state: PublicPathState<TValue>) => TExtraProps;
  validateOnBlur: boolean;
  validateOnChange: boolean;
  validateOnInput: boolean;
}

export type LazyInputBindsConfig<TValue = unknown, TExtraProps extends GenericObject = GenericObject> = (
  state: PublicPathState<TValue>
) => Partial<{
  attrs: TExtraProps;
  validateOnBlur: boolean;
  validateOnChange: boolean;
  validateOnInput: boolean;
}>;

export interface FormContext<TValues extends GenericObject = GenericObject, TOutput = TValues>
  extends Omit<
    PrivateFormContext<TValues, TOutput>,
    | 'formId'
    | 'schema'
    | 'initialValues'
    | 'getPathState'
    | 'getAllPathStates'
    | 'removePathState'
    | 'unsetPathValue'
    | 'validateSchema'
    | 'stageInitialValue'
    | 'setFieldInitialValue'
    | 'unsetInitialValue'
    | 'fieldArrays'
    | 'markForUnmount'
    | 'keepValuesOnUnmount'
    | 'values'
  > {
  values: DeepReadonly<TValues>;
  handleReset: () => void;
  submitForm: (e?: unknown) => Promise<void>;
  defineComponentBinds<
    TPath extends Path<TValues>,
    TValue = PathValue<TValues, TPath>,
    TExtras extends GenericObject = GenericObject
  >(
    path: MaybeRefOrGetter<TPath>,
    config?: Partial<ComponentBindsConfig<TValue, TExtras>> | LazyComponentBindsConfig<TValue, TExtras>
  ): Ref<BaseComponentBinds<TValue> & TExtras>;
  defineInputBinds<
    TPath extends Path<TValues>,
    TValue = PathValue<TValues, TPath>,
    TExtras extends GenericObject = GenericObject
  >(
    path: MaybeRefOrGetter<TPath>,
    config?: Partial<InputBindsConfig<TValue, TExtras>> | LazyInputBindsConfig<TValue, TExtras>
  ): Ref<BaseInputBinds<TValue> & TExtras>;
}
