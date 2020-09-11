import { ValidationFlags } from './types';
import { setConfig } from './config';
import { isCallable } from './utils';

interface ModeContext {
  errors: string[];
  value: any;
  flags: ValidationFlags;
}

export interface InteractionSetting {
  on?: string[];
  debounce?: number;
}

export type InteractionModeFactory = (ctx: ModeContext) => InteractionSetting;

const aggressive: InteractionModeFactory = () => ({
  on: ['input', 'blur']
});

const lazy: InteractionModeFactory = () => ({
  on: ['change', 'blur']
});

const eager: InteractionModeFactory = ({ errors }) => {
  if (errors.length) {
    return {
      on: ['input', 'change']
    };
  }

  return {
    on: ['change', 'blur']
  };
};

const passive: InteractionModeFactory = () => ({
  on: []
});

export const modes: { [k: string]: InteractionModeFactory } = {
  aggressive,
  eager,
  passive,
  lazy
};

export const setInteractionMode = (mode: string, implementation?: InteractionModeFactory) => {
  setConfig({ mode });
  if (!implementation) {
    return;
  }

  if (!isCallable(implementation)) {
    throw new Error('A mode implementation must be a function');
  }

  modes[mode] = implementation;
};
