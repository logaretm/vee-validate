import { ComputedRef, Ref } from 'vue';
import { ObjectSchema } from 'yup';

export interface ValidationResult {
  errors: string[];
}

// eslint-disable-next-line @typescript-eslint/ban-types
export type Locator = { __locatorRef: string } & Function;

// Extracts explicit keys of an interface without index signature
// https://stackoverflow.com/questions/51465182/typescript-remove-index-signature-using-mapped-types
export type KnownKeys<T> = {
  [K in keyof T]: string extends K ? never : number extends K ? never : K;
} extends { [_ in keyof T]: infer U }
  ? U
  : never;

export interface FieldMeta {
  touched: boolean;
  dirty: boolean;
  valid: boolean;
  pending: boolean;
  initialValue?: any;
}

export type MaybeReactive<T> = Ref<T> | ComputedRef<T> | T;

export type SubmitEvent = Event & { target: HTMLFormElement };

export type GenericValidateFunction = (value: any) => boolean | string | Promise<boolean | string>;

export interface FormState<TValues> {
  values: TValues;
  errors: Partial<Record<keyof TValues, string | undefined>>;
  dirty: Partial<Record<keyof TValues, boolean>>;
  touched: Partial<Record<keyof TValues, boolean>>;
  submitCount: number;
}

export interface SetFieldValueOptions {
  force: boolean;
}
export interface FormActions<TValues> {
  setFieldValue<T extends keyof TValues>(field: T, value: TValues[T], opts?: Partial<SetFieldValueOptions>): void;
  setFieldError: (field: keyof TValues, message: string | undefined) => void;
  setErrors: (fields: Partial<Record<keyof TValues, string | undefined>>) => void;
  setValues<T extends keyof TValues>(fields: Partial<Record<T, TValues[T]>>): void;
  setFieldTouched: (field: keyof TValues, isTouched: boolean) => void;
  setTouched: (fields: Partial<Record<keyof TValues, boolean>>) => void;
  setFieldDirty: (field: keyof TValues, isDirty: boolean) => void;
  setDirty: (fields: Partial<Record<keyof TValues, boolean>>) => void;
  resetForm: (state?: Partial<FormState<TValues>>) => void;
}

export interface FormContext<TValues extends Record<string, any> = Record<string, any>> extends FormActions<TValues> {
  register(field: any): void;
  unregister(field: any): void;
  values: TValues;
  fields: ComputedRef<Record<keyof TValues, any>>;
  submitCount: Ref<number>;
  schema?: Record<keyof TValues, GenericValidateFunction | string | Record<string, any>> | ObjectSchema<TValues>;
  validateSchema?: (shouldMutate?: boolean) => Promise<Record<keyof TValues, ValidationResult>>;
}

interface SubmissionContext<TValues extends Record<string, any> = Record<string, any>> extends FormActions<TValues> {
  evt: SubmitEvent;
}

export type SubmissionHandler<TValues extends Record<string, any> = Record<string, any>> = (
  values: TValues,
  ctx: SubmissionContext<TValues>
) => any;
