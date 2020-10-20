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

export interface FormContext {
  register(field: any): void;
  unregister(field: any): void;
  values: Record<string, any>;
  fields: ComputedRef<Record<string, any>>;
  schema?: Record<string, GenericValidateFunction | string | Record<string, any>> | ObjectSchema;
  validateSchema?: (shouldMutate?: boolean) => Promise<Record<string, ValidationResult>>;
  setFieldValue: (path: string, value: any) => void;
  setFieldError: (field: string, message: string) => void;
  setErrors: (fields: Record<string, string>) => void;
  setValues: (fields: Record<string, any>) => void;
  setFieldTouched: (field: string, isTouched: boolean) => void;
  setTouched: (fields: Record<string, boolean>) => void;
  setFieldDirty: (field: string, isDirty: boolean) => void;
  setDirty: (fields: Record<string, boolean>) => void;
  reset: () => void;
}

type SubmissionContext = { evt: SubmitEvent; form: FormContext };

export type SubmissionHandler = (values: Record<string, any>, ctx: SubmissionContext) => any;
