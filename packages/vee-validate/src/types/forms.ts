import { ComputedRef, Ref, MaybeRef, MaybeRefOrGetter } from 'vue';
import { GenericObject, MaybeArray, MaybePromise, FlattenAndSetPathsType, MapValuesPathsToRefs } from './common';
import { FieldValidationMetaInfo } from '../../../shared';
import { Path, PathValue } from './paths';
import { PartialDeep } from 'type-fest';
import type { StandardSchemaV1 } from '@standard-schema/spec';

export interface ValidationResult<TValue = unknown> {
  errors: string[];
  valid: boolean;
  value?: TValue;
}

export type FlattenAndMapPathsValidationResult<TInput extends GenericObject, TOutput extends GenericObject> = {
  [K in Path<TInput>]: ValidationResult<TOutput[K]>;
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
  warn: boolean;
}

export type FieldValidator<TOutput> = (opts?: Partial<ValidationOptions>) => Promise<ValidationResult<TOutput>>;

export interface PathStateConfig<TOutput> {
  bails: boolean;
  label: MaybeRefOrGetter<string | undefined>;
  type: InputType;
  validate: FieldValidator<TOutput>;
  schema?: MaybeRefOrGetter<StandardSchemaV1 | undefined>;
}

export type IssueCollection<TPath = string> = {
  path: TPath;
  messages: string[];
};

export interface PathState<TInput = unknown, TOutput = TInput> {
  id: number | number[];
  path: string;
  touched: boolean;
  dirty: boolean;
  valid: boolean;
  validated: boolean;
  pending: boolean;
  initialValue: TInput | undefined;
  value: TInput | undefined;
  errors: string[];
  bails: boolean;
  label: string | undefined;
  type: InputType;
  multiple: boolean;
  fieldsCount: number;
  __flags: {
    pendingUnmount: Record<string, boolean>;
    pendingReset: boolean;
  };
  validate?: FieldValidator<TOutput>;
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
  path: MaybeRefOrGetter<string>;
}

export interface PrivateFieldContext<TInput = unknown, TOutput = TInput> {
  id: number;
  name: MaybeRef<string>;
  value: Ref<TInput>;
  meta: FieldMeta<TInput>;
  errors: Ref<string[]>;
  errorMessage: Ref<string | undefined>;
  label?: MaybeRefOrGetter<string | undefined>;
  type?: string;
  bails?: boolean;
  keepValueOnUnmount?: MaybeRefOrGetter<boolean | undefined>;
  checkedValue?: MaybeRefOrGetter<TInput>;
  uncheckedValue?: MaybeRefOrGetter<TInput>;
  checked?: Ref<boolean>;
  resetField(state?: Partial<FieldState<TInput>>): void;
  handleReset(): void;
  validate: FieldValidator<TOutput>;
  handleChange(e: Event | unknown, shouldValidate?: boolean): void;
  handleBlur(e?: Event, shouldValidate?: boolean): void;
  setState(state: Partial<FieldState<TInput>>): void;
  setTouched(isTouched: boolean): void;
  setErrors(message: string | string[]): void;
  setValue(value: TInput, shouldValidate?: boolean): void;
}

export type FieldContext<TValue = unknown> = Omit<PrivateFieldContext<TValue>, 'id' | 'instances'>;

export type GenericValidateFunction<TValue = unknown> = (
  value: TValue,
  ctx: FieldValidationMetaInfo,
) => MaybePromise<boolean | MaybeArray<string>>;

export interface FormState<TValues> {
  values: PartialDeep<TValues>;
  errors: Partial<Record<Path<TValues>, string | undefined>>;
  touched: Partial<Record<Path<TValues>, boolean>>;
  submitCount: number;
}

export type FormErrors<TValues extends GenericObject> = Partial<Record<Path<TValues> | '', string | undefined>>;
export type FormErrorBag<TValues extends GenericObject> = Partial<Record<Path<TValues> | '', string[]>>;

export interface ResetFormOpts {
  force: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface FormActions<TValues extends GenericObject, TOutput = TValues> {
  setFieldValue<T extends Path<TValues>>(field: T, value: PathValue<TValues, T>, shouldValidate?: boolean): void;
  setFieldError(field: Path<TValues>, message: string | string[] | undefined): void;
  setErrors(fields: Partial<FlattenAndSetPathsType<TValues, string | string[] | undefined>>): void;
  setValues(fields: PartialDeep<TValues>, shouldValidate?: boolean): void;
  setFieldTouched(field: Path<TValues>, isTouched: boolean): void;
  setTouched(fields: Partial<Record<Path<TValues>, boolean>> | boolean): void;
  resetForm(state?: Partial<FormState<TValues>>, opts?: Partial<ResetFormOpts>): void;
  resetField(field: Path<TValues>, state?: Partial<FieldState>): void;
}

export interface FormValidationResult<TInput extends GenericObject, TOutput extends GenericObject = TInput> {
  valid: boolean;
  results: Partial<FlattenAndMapPathsValidationResult<TInput, TOutput>>;
  errors: Partial<Record<Path<TInput>, string>>;
  values?: Partial<TOutput>;
  source: 'schema' | 'fields' | 'none';
}

export interface SubmissionContext<TInput extends GenericObject = GenericObject> extends FormActions<TInput> {
  evt?: Event;
  controlledValues: Partial<TInput>;
}

export type SubmissionHandler<TInput extends GenericObject = GenericObject, TOutput = TInput, TReturn = unknown> = (
  values: TOutput,
  ctx: SubmissionContext<TInput>,
) => TReturn;

export interface InvalidSubmissionContext<
  TInput extends GenericObject = GenericObject,
  TOutput extends GenericObject = TInput,
> {
  values: TInput;
  evt?: Event;
  errors: Partial<Record<Path<TInput>, string>>;
  results: FormValidationResult<TInput, TOutput>['results'];
}

export type InvalidSubmissionHandler<
  TInput extends GenericObject = GenericObject,
  TOutput extends GenericObject = TInput,
> = (ctx: InvalidSubmissionContext<TInput, TOutput>) => void;

export type RawFormSchema<TValues> = Record<Path<TValues>, string | GenericValidateFunction | GenericObject>;

export type FieldPathLookup<TValues extends GenericObject = GenericObject> = Partial<
  Record<Path<TValues>, PrivateFieldContext | PrivateFieldContext[]>
>;

type HandleSubmitFactory<TValues extends GenericObject, TOutput extends GenericObject = TValues> = <TReturn = unknown>(
  cb: SubmissionHandler<TValues, TOutput, TReturn>,
  onSubmitValidationErrorCb?: InvalidSubmissionHandler<TValues, TOutput>,
) => (e?: Event) => Promise<TReturn | undefined>;

export type PublicPathState<TValue = unknown> = Omit<
  PathState<TValue>,
  'bails' | 'label' | 'multiple' | 'fieldsCount' | 'validate' | 'id' | 'type' | '__flags'
>;

export interface BaseFieldProps {
  onBlur: () => void;
  onChange: () => void;
  onInput: () => void;
}

export interface InputBindsConfig<TValue = unknown, TExtraProps extends GenericObject = GenericObject> {
  props: (state: PublicPathState<TValue>) => TExtraProps;
  validateOnBlur: boolean;
  label: MaybeRefOrGetter<string>;
  validateOnChange: boolean;
  validateOnInput: boolean;
  validateOnModelUpdate: boolean;
}

export type LazyInputBindsConfig<TValue = unknown, TExtraProps extends GenericObject = GenericObject> = (
  state: PublicPathState<TValue>,
) => Partial<{
  props: TExtraProps;
  validateOnBlur: boolean;
  validateOnChange: boolean;
  validateOnInput: boolean;
  validateOnModelUpdate: boolean;
}>;

export interface ComponentBindsConfig<
  TValue = unknown,
  TExtraProps extends GenericObject = GenericObject,
  TModel extends string = 'modelValue',
> {
  mapProps: (state: PublicPathState<TValue>) => TExtraProps;
  validateOnBlur: boolean;
  validateOnModelUpdate: boolean;
  model: TModel;
}

export type LazyComponentBindsConfig<
  TValue = unknown,
  TExtraProps extends GenericObject = GenericObject,
  TModel extends string = 'modelValue',
> = (state: PublicPathState<TValue>) => Partial<{
  props: TExtraProps;
  validateOnBlur: boolean;
  validateOnModelUpdate: boolean;
  model: TModel;
}>;

export interface ComponentModellessBinds {
  onBlur: () => void;
}

export type ComponentModelBinds<TValue = any, TModel extends string = 'modelValue'> = ComponentModellessBinds & {
  [TKey in `onUpdate:${TModel}`]: (value: TValue) => void;
};

export type BaseComponentBinds<TValue = any, TModel extends string = 'modelValue'> = ComponentModelBinds<
  TValue,
  TModel
> & {
  [k in TModel]: TValue;
};

export interface BaseInputBinds<TValue = unknown> {
  value: TValue | undefined;
  onBlur: (e: Event) => void;
  onChange: (e: Event) => void;
  onInput: (e: Event) => void;
}

export interface PrivateFormContext<
  TValues extends GenericObject = GenericObject,
  TOutput extends GenericObject = TValues,
> extends FormActions<TValues> {
  name: string;
  formId: number;
  values: TValues;
  initialValues: Ref<Partial<TValues>>;
  controlledValues: Ref<TValues>;
  fieldArrays: PrivateFieldArrayContext[];
  submitCount: Ref<number>;
  schema?: MaybeRef<RawFormSchema<TValues> | StandardSchemaV1<TValues, TOutput> | undefined>;
  errorBag: Ref<FormErrorBag<TValues>>;
  errors: ComputedRef<FormErrors<TValues>>;
  meta: ComputedRef<FormMeta<TValues>>;
  isSubmitting: Ref<boolean>;
  isValidating: Ref<boolean>;
  keepValuesOnUnmount: MaybeRef<boolean>;
  validateSchema?: (mode: SchemaValidationMode) => Promise<FormValidationResult<TValues, TOutput>>;
  validate(opts?: Partial<ValidationOptions>): Promise<FormValidationResult<TValues, TOutput>>;
  validateField<TPath extends Path<TValues>>(
    field: TPath,
    opts?: Partial<ValidationOptions>,
  ): Promise<ValidationResult<TOutput[TPath]>>;
  stageInitialValue(path: string, value: unknown, updateOriginal?: boolean): void;
  unsetInitialValue(path: string): void;
  handleSubmit: HandleSubmitFactory<TValues, TOutput> & { withControlled: HandleSubmitFactory<TValues, TOutput> };
  setFieldInitialValue(path: string, value: unknown, updateOriginal?: boolean): void;
  createPathState<TPath extends Path<TValues>>(
    path: MaybeRef<TPath>,
    config?: Partial<PathStateConfig<TOutput[TPath]>>,
  ): PathState<PathValue<TValues, TPath>>;
  getPathState<TPath extends Path<TValues>>(path: TPath): PathState<PathValue<TValues, TPath>> | undefined;
  getAllPathStates(): PathState[];
  removePathState<TPath extends Path<TValues>>(path: TPath, id: number): void;
  unsetPathValue<TPath extends Path<TValues>>(path: TPath): void;
  destroyPath(path: string): void;
  isFieldTouched<TPath extends Path<TValues>>(path: TPath): boolean;
  isFieldDirty<TPath extends Path<TValues>>(path: TPath): boolean;
  isFieldValid<TPath extends Path<TValues>>(path: TPath): boolean;
  defineField<
    TPath extends Path<TValues>,
    TValue = PathValue<TValues, TPath>,
    TExtras extends GenericObject = GenericObject,
  >(
    path: MaybeRefOrGetter<TPath>,
    config?: Partial<InputBindsConfig<TValue, TExtras>> | LazyInputBindsConfig<TValue, TExtras>,
  ): [Ref<TValue>, Ref<BaseFieldProps & TExtras>];
  /**
   * @deprecated use defineField instead
   */
  useFieldModel<TPath extends Path<TValues>>(path: TPath): Ref<PathValue<TValues, TPath>>;
  /**
   * @deprecated use defineField instead
   */
  useFieldModel<TPaths extends readonly [...MaybeRef<Path<TValues>>[]]>(
    paths: TPaths,
  ): MapValuesPathsToRefs<TValues, TPaths>;
  /**
   * @deprecated use defineField instead
   */
  defineComponentBinds<
    TPath extends Path<TValues>,
    TValue = PathValue<TValues, TPath>,
    TModel extends string = 'modelValue',
    TExtras extends GenericObject = GenericObject,
  >(
    path: MaybeRefOrGetter<TPath>,
    config?: Partial<ComponentBindsConfig<TValue, TExtras, TModel>> | LazyComponentBindsConfig<TValue, TExtras, TModel>,
  ): Ref<BaseComponentBinds<TValue, TModel> & TExtras>;
  /**
   * @deprecated use defineField instead
   */
  defineInputBinds<
    TPath extends Path<TValues>,
    TValue = PathValue<TValues, TPath>,
    TExtras extends GenericObject = GenericObject,
  >(
    path: MaybeRefOrGetter<TPath>,
    config?: Partial<InputBindsConfig<TValue, TExtras>> | LazyInputBindsConfig<TValue, TExtras>,
  ): Ref<BaseInputBinds<TValue> & TExtras>;
}

export interface FormContext<TValues extends GenericObject = GenericObject, TOutput extends GenericObject = TValues>
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
  values: TValues;
  handleReset: () => void;
  submitForm: (e?: unknown) => Promise<void>;
}
