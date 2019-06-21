import { ValidationFlags } from './types';
import { setConfig } from './config';
import { isCallable } from './utils';

interface ModeContext {
  errors: string[];
  value: unknown;
  flags: ValidationFlags;
}

export interface InteractionSetting {
  on?: string[];
  debounce?: number;
}

export type InteractionModeFactory = (ctx: ModeContext) => InteractionSetting;

const aggressive: InteractionModeFactory = () => ({
  on: ['input']
});

const lazy: InteractionModeFactory = () => ({
  on: ['change']
});

const eager: InteractionModeFactory = ({ errors }) => {
  if (errors.length) {
    return {
      on: ['input']
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
