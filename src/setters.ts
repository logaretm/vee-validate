import dictionary from './dictionary';
import { isCallable } from './utils';
import { setConfig, VeeValidateConfig } from './config';
import { modes, InteractionModeFactory } from './modes';
import { I18nDriver } from './core/i18n';

export const configure = (cfg: Partial<VeeValidateConfig>) => {
  setConfig(cfg);
};

export const setI18nDriver = (driver: I18nDriver) => {
  dictionary.setDriver(driver);
};

export const setMode = (mode: string, implementation: InteractionModeFactory) => {
  setConfig({ mode });
  if (!implementation) {
    return;
  }

  if (!isCallable(implementation)) {
    throw new Error('A mode implementation must be a function');
  }

  modes[mode] = implementation;
};
