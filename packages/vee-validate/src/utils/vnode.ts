import { SetupContext } from 'vue';

export const normalizeChildren = (context: SetupContext, slotProps: any) => {
  if (!context.slots.default) {
    return context.slots.default;
  }

  return context.slots.default(slotProps);
};
