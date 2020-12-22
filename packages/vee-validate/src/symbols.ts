import { ComputedRef, InjectionKey } from 'vue';
import { FormContext } from './types';
import { useField } from './useField';

export const FormContextSymbol: InjectionKey<FormContext> = Symbol('vee-validate-form');

export const FormErrorsSymbol: InjectionKey<ComputedRef<Record<string, string | undefined>>> = Symbol(
  'vee-validate-form-errors'
);

export const FormInitialValuesSymbol: InjectionKey<ComputedRef<Record<string, any>>> = Symbol(
  'vee-validate-form-initial-values'
);

export const FieldContextSymbol: InjectionKey<ReturnType<typeof useField>> = Symbol('vee-validate-field-instance');
