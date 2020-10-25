import { ComputedRef, InjectionKey } from 'vue';
import { FormContext } from './types';

export const FormSymbol: InjectionKey<FormContext> = Symbol('vee-validate-form');

export const FormErrorsSymbol: InjectionKey<ComputedRef<Record<string, string | undefined>>> = Symbol(
  'vee-validate-form-errors'
);

export const FormInitialValues: InjectionKey<ComputedRef<Record<string, any>>> = Symbol(
  'vee-validate-form-initial-values'
);
