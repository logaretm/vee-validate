import { ValidationFlags } from "./types";

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
