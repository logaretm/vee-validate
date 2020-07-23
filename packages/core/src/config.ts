import { ValidationMessageGenerator } from '../../shared';

export interface VeeValidateConfig {
  bails: boolean;
  generateMessage: ValidationMessageGenerator;
  skipOptional: boolean;
}

const DEFAULT_CONFIG: VeeValidateConfig = {
  generateMessage: ({ field }) => `${field} is not valid.`,
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
