import { computed, provide, h, defineComponent } from 'vue';
import { useForm } from './useForm';
import { SubmissionHandler } from './types';
import { useRefsObjToComputed, normalizeChildren } from './utils';

export const Form = defineComponent({
  name: 'Form',
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
    initialValues: {
      type: Object,
      default: undefined,
    },
  },
  setup(props, ctx) {
    const { form, errors, validate, handleSubmit, handleReset, values, meta, isSubmitting, submitForm } = useForm({
      validationSchema: props.validationSchema,
      initialValues: props.initialValues,
    });

    provide('$_veeForm', form);
    const unwrappedMeta = useRefsObjToComputed(meta);

    const slotProps = computed(() => {
      return {
        meta: unwrappedMeta.value,
        errors: errors.value,
        values: values.value,
        isSubmitting: isSubmitting.value,
        validate,
        handleSubmit,
        handleReset,
        submitForm,
      };
    });

    const onSubmit = ctx.attrs.onSubmit ? handleSubmit(ctx.attrs.onSubmit as SubmissionHandler) : submitForm;
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
