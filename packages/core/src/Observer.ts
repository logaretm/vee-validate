import { computed, provide, h, defineComponent } from 'vue';
import { normalizeChildren } from './utils/vnode';
import { useForm } from './useForm';
import { ValidationFlags, SubmissionHandler } from './types';

export const ValidationObserver = defineComponent({
  name: 'ValidationObserver',
  inheritAttrs: false,
  props: {
    as: {
      type: String,
      default: undefined,
    },
    validationSchema: {
      type: Object,
      default: undefined,
    },
  },
  setup(props, ctx) {
    const { form, errors, validate, handleSubmit, handleReset, values, ...flags } = useForm({
      validationSchema: props.validationSchema,
    });

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

    const onSubmit = handleSubmit(ctx.attrs.onSubmit as SubmissionHandler);

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
            onSubmit,
            onReset: handleFormReset,
          },
          children
        );
      }

      return children;
    };
  },
});
