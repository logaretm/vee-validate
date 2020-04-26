import { computed, provide, h, defineComponent } from 'vue';
import { normalizeChildren } from './utils/vnode';
import { useForm } from './useForm';
import { ValidationFlags } from './types';

export const ValidationObserver: any = defineComponent({
  name: 'ValidationObserver',
  inheritAttrs: false,
  props: {
    as: {
      type: String,
      default: undefined,
    },
  },
  setup(props, ctx) {
    const { form, errors, validate, handleSubmit, handleReset, values, ...flags } = useForm();
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
        handleReset,
      };
    });

    function handleFormSubmit(e: Event) {
      e.preventDefault();
      e.stopPropagation();

      return handleSubmit(ctx.attrs.onSubmit as Function);
    }

    function handleFormReset() {
      handleReset();
      if (typeof ctx.attrs.onReset === 'function') {
        ctx.attrs.onReset();
      }
    }

    return () => {
      const children = normalizeChildren(ctx, slotProps.value);
      if (props.as) {
        return h(
          props.as,
          {
            // Disables native validation as vee-validate will handle it.
            novalidate: true,
            ...ctx.attrs,
            onSubmit: handleFormSubmit,
            onReset: handleFormReset,
          },
          children
        );
      }

      return children;
    };
  },
});
