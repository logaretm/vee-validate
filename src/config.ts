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
  useConstraintAttrs: boolean;
  mode: string | InteractionModeFactory;
  classes: ValidationClassMap;
  defaultMessage: ValidationMessageTemplate;
  skipOptional: boolean;
}

const DEFAULT_CONFIG: VeeValidateConfig = {
  defaultMessage: `{_field_} is not valid.`,
  skipOptional: true,
  classes: {
    touched: 'touched', // the control has been blurred
    untouched: 'untouched', // the control hasn't been blurred
    valid: 'valid', // model is valid
    invalid: 'invalid', // model is invalid
    pristine: 'pristine', // control has not been interacted with
    dirty: 'dirty' // control has been interacted with
  },
  bails: true,
  mode: 'aggressive',
  useConstraintAttrs: true
};

export let currentConfig: VeeValidateConfig = { ...DEFAULT_CONFIG };

export const getConfig = () => currentConfig;

export const setConfig = (newConf: Partial<VeeValidateConfig>) => {
  currentConfig = { ...currentConfig, ...newConf };
};

export const configure = (cfg: Partial<VeeValidateConfig>) => {
  setConfig(cfg);
};
