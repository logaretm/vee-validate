import { h, defineComponent, toRef } from 'vue';
import { useForm } from './useForm';
import { SubmissionHandler } from './types';
import { normalizeChildren } from './utils';

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
    validateOnMount: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, ctx) {
    const initialValues = toRef(props, 'initialValues');
    const {
      errors,
      validate,
      handleSubmit,
      handleReset,
      values,
      meta,
      isSubmitting,
      submitForm,
      setErrors,
      setFieldError,
      setFieldValue,
      setValues,
      setFieldDirty,
      setDirty,
      setFieldTouched,
      setTouched,
    } = useForm({
      validationSchema: props.validationSchema,
      initialValues,
      validateOnMount: props.validateOnMount,
    });

    const onSubmit = ctx.attrs.onSubmit ? handleSubmit(ctx.attrs.onSubmit as SubmissionHandler) : submitForm;
    function handleFormReset() {
      handleReset();
      if (typeof ctx.attrs.onReset === 'function') {
        ctx.attrs.onReset();
      }
    }

    function handleScopedSlotSubmit(evt: Event | SubmissionHandler, onSubmit?: SubmissionHandler) {
      const onSuccess = typeof evt === 'function' && !onSubmit ? evt : onSubmit;

      return handleSubmit(onSuccess)(evt);
    }

    return function renderForm(this: any) {
      // FIXME: Hacky but cute way to expose some stuff to the rendered instance
      // getCurrentInstance doesn't work with render fns, it returns the wrong instance
      // we want to expose setFieldError and setErrors
      if (!('setErrors' in this)) {
        this.setFieldError = setFieldError;
        this.setErrors = setErrors;
        this.setFieldValue = setFieldValue;
        this.setValues = setValues;
        this.setFieldDirty = setFieldDirty;
        this.setDirty = setDirty;
        this.setFieldTouched = setFieldTouched;
        this.setTouched = setTouched;
      }

      const children = normalizeChildren(ctx, {
        meta: meta.value,
        errors: errors.value,
        values: values,
        isSubmitting: isSubmitting.value,
        validate,
        handleSubmit: handleScopedSlotSubmit,
        handleReset,
        submitForm,
        setErrors,
        setFieldError,
        setFieldValue,
        setValues,
        setFieldDirty,
        setDirty,
        setFieldTouched,
        setTouched,
      });

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
