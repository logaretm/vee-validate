import { getPath } from './utils';
import { InteractionModeFactory } from './modes';
import { ValidationMessageTemplate } from './types';

type ValidationClass = string | string[] | undefined;

export interface ValidationClassMap {
  touched?: ValidationClass;
  untouched?: ValidationClass;
  valid?: ValidationClass;
  invalid?: ValidationClass;
  pristine?: ValidationClass;
  dirty?: ValidationClass;
  [k: string]: ValidationClass;
}

export interface VeeValidateConfig {
  bails: boolean;
  aria: boolean;
  validity: boolean;
  useConstraintAttrs: boolean;
  mode: string | InteractionModeFactory;
  classNames: ValidationClassMap;
  delay: number;
  defaultMessage: ValidationMessageTemplate;
}

const DEFAULT_CONFIG: VeeValidateConfig = {
  defaultMessage: `{_field_} is not valid.`,
  classNames: {
    touched: 'touched', // the control has been blurred
    untouched: 'untouched', // the control hasn't been blurred
    valid: 'valid', // model is valid
    invalid: 'invalid', // model is invalid
    pristine: 'pristine', // control has not been interacted with
    dirty: 'dirty' // control has been interacted with
  },
  bails: true,
  aria: true,
  validity: false,
  mode: 'aggressive',
  useConstraintAttrs: true,
  delay: 0
};

export let currentConfig: VeeValidateConfig = { ...DEFAULT_CONFIG };

export const getConfig = () => currentConfig;

export const setConfig = (newConf: Partial<VeeValidateConfig>) => {
  currentConfig = { ...currentConfig, ...newConf };
};
