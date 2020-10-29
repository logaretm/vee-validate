import { VNode, SetupContext } from 'vue';

export const normalizeChildren: (c: SetupContext, a: any) => VNode[] = (context: SetupContext, slotProps: any) => {
  if (!context.slots.default) {
    return [];
  }

  return context.slots.default(slotProps) || [];
};
