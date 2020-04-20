import { SetupContext, computed, provide } from 'vue';
import { normalizeChildren } from './utils/vnode';
import { useForm } from './useForm';
import { ValidationFlags } from './types';

export const ValidationObserver: any = {
  name: 'ValidationObserver',
  setup(_: any, ctx: SetupContext) {
    const { form, errors, validate, handleSubmit, reset, values, ...flags } = useForm();
    provide('$_veeObserver', form);

    const slotProps = computed(() => {
      return {
        ...Object.keys(flags).reduce((acc: ValidationFlags, key) => {
          acc[key] = (flags as any)[key].value;

          return acc;
        }, {} as ValidationFlags),
        errors: errors.value,
        values: values.value,
        validate,
        handleSubmit,
        handleReset: reset,
      };
    });

    return () => normalizeChildren(ctx, slotProps.value);
  },
};
