import { SetupContext, computed, provide } from 'vue';
import { normalizeChildren } from '../utils/vnode';
import { useForm } from '../useForm';

export const ValidationObserver = {
  name: 'ValidationObserver',
  setup(_: any, ctx: SetupContext) {
    const { form, errors, validate, handleSubmit, reset, ...flags } = useForm();
    provide('$_veeObserver', form);

    const slotProps = computed(() => {
      return {
        ...flags,
        errors: errors.value,
        validate,
        handleSubmit,
        reset
      };
    });

    return () => normalizeChildren(ctx, slotProps.value);
  }
};
