import { isCallable } from './utils';
import { setConfig, VeeValidateConfig } from './config';
import { modes, InteractionModeFactory } from './modes';

export const configure = (cfg: Partial<VeeValidateConfig>) => {
  setConfig(cfg);
};

export const setInteractionMode = (mode: string, implementation: InteractionModeFactory) => {
  setConfig({ mode });
  if (!implementation) {
    return;
  }

  if (!isCallable(implementation)) {
    throw new Error('A mode implementation must be a function');
  }

  modes[mode] = implementation;
};
