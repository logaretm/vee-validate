export interface VeeValidateConfig {
  bails: boolean;
  defaultMessage: ValidationMessageGenerator;
  skipOptional: boolean;
}

const DEFAULT_CONFIG: VeeValidateConfig = {
  defaultMessage: ({ field }) => `${field} is not valid.`,
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
