import { ComputedRef, InjectionKey } from 'vue';
import { PrivateFormContext, PrivateFieldContext } from './types';

export const FormContextKey: InjectionKey<PrivateFormContext> = Symbol('vee-validate-form');

export const FormErrorsKey: InjectionKey<ComputedRef<Record<string, string | undefined>>> =
  Symbol('vee-validate-form-errors');

export const FormInitialValuesKey: InjectionKey<ComputedRef<Record<string, unknown>>> = Symbol(
  'vee-validate-form-initial-values'
);

export const FieldContextKey: InjectionKey<PrivateFieldContext<unknown>> = Symbol('vee-validate-field-instance');

export const IS_ABSENT = Symbol('Default empty value');
