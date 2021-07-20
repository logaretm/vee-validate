import { ComputedRef, InjectionKey } from 'vue';
import { FormContext, PrivateFieldComposite } from './types';

export const FormContextKey: InjectionKey<FormContext> = Symbol('vee-validate-form');

export const FormErrorsKey: InjectionKey<ComputedRef<Record<string, string | undefined>>> =
  Symbol('vee-validate-form-errors');

export const FormInitialValuesKey: InjectionKey<ComputedRef<Record<string, unknown>>> = Symbol(
  'vee-validate-form-initial-values'
);

export const FieldContextKey: InjectionKey<PrivateFieldComposite<unknown>> = Symbol('vee-validate-field-instance');

export const EMPTY_VALUE = Symbol('Default empty value');
