import { ValidationMessageGenerator } from '../../shared';

export interface VeeValidateConfig {
  bails: boolean;
  generateMessage: ValidationMessageGenerator;
}

const DEFAULT_CONFIG: VeeValidateConfig = {
  generateMessage: ({ field }) => `${field} is not valid.`,
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
