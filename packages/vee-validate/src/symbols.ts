import { InjectionKey } from 'vue';
import { PrivateFormContext, PrivateFieldContext, FormContext } from './types';

export const FormContextKey: InjectionKey<PrivateFormContext> = Symbol('vee-validate-form');

export const PublicFormContextKey: InjectionKey<FormContext> = Symbol('vee-validate-form-context');

export const FieldContextKey: InjectionKey<PrivateFieldContext<unknown>> = Symbol('vee-validate-field-instance');

export const IS_ABSENT = Symbol('Default empty value');
