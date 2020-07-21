import { computed, h, defineComponent } from 'vue';
import { useForm } from './useForm';
import { SubmissionHandler } from './types';
import { useRefsObjToComputed, normalizeChildren } from './utils';

export const Form = defineComponent({
  name: 'Form',
  inheritAttrs: false,
  props: {
    as: {
      type: String,
      default: 'form',
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
    const { errors, validate, handleSubmit, handleReset, values, meta, isSubmitting, submitForm } = useForm({
      validationSchema: props.validationSchema,
      initialValues: props.initialValues,
    });

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
      if (!props.as) {
        return children;
      }

      // Attributes to add on a native `form` tag
      const formAttrs =
        props.as === 'form'
          ? {
              // Disables native validation as vee-validate will handle it.
              novalidate: true,
            }
          : {};

      return h(
        props.as,
        {
          ...formAttrs,
          ...ctx.attrs,
          onSubmit,
          onReset: handleFormReset,
        },
        children
      );
    };
  },
});
