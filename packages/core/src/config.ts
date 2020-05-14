import { ValidationMessageTemplate } from './types';

export interface VeeValidateConfig {
  bails: boolean;
  defaultMessage: ValidationMessageTemplate;
  skipOptional: boolean;
}

const DEFAULT_CONFIG: VeeValidateConfig = {
  defaultMessage: `{_field_} is not valid.`,
  skipOptional: true,
  bails: true,
};

export let currentConfig: VeeValidateConfig = { ...DEFAULT_CONFIG };

export const getConfig = () => currentConfig;

export const setConfig = (newConf: Partial<VeeValidateConfig>) => {
  currentConfig = { ...currentConfig, ...newConf };
};

export const configure = (cfg: Partial<VeeValidateConfig>) => {
  setConfig(cfg);
};
