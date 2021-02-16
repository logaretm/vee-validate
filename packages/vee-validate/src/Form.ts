import { h, defineComponent, toRef, resolveDynamicComponent, computed, PropType } from 'vue';
import { useForm } from './useForm';
import { SubmissionHandler, SubmitEvent } from './types';
import { isEvent, normalizeChildren } from './utils';

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
    initialErrors: {
      type: Object,
      default: undefined,
    },
    initialTouched: {
      type: Object,
      default: undefined,
    },
    validateOnMount: {
      type: Boolean,
      default: false,
    },
    onSubmit: {
      type: Function as PropType<SubmissionHandler>,
      default: undefined,
    },
  },
  setup(props, ctx) {
    const initialValues = toRef(props, 'initialValues');
    const {
      errors,
      values,
      meta,
      isSubmitting,
      submitCount,
      validate,
      validateField,
      handleReset,
      resetForm,
      handleSubmit,
      submitForm,
      setErrors,
      setFieldError,
      setFieldValue,
      setValues,
      setFieldTouched,
      setTouched,
    } = useForm({
      validationSchema: props.validationSchema,
      initialValues,
      initialErrors: props.initialErrors,
      initialTouched: props.initialTouched,
      validateOnMount: props.validateOnMount,
    });

    const onSubmit = props.onSubmit ? handleSubmit(props.onSubmit) : submitForm;
    function handleFormReset(e?: Event) {
      if (isEvent(e)) {
        // Prevent default form reset behavior
        e.preventDefault();
      }

      handleReset();
      if (typeof ctx.attrs.onReset === 'function') {
        ctx.attrs.onReset();
      }
    }

    function handleScopedSlotSubmit(evt: Event | SubmissionHandler, onSubmit?: SubmissionHandler) {
      const onSuccess = typeof evt === 'function' && !onSubmit ? evt : onSubmit;

      return handleSubmit(onSuccess as SubmissionHandler<Record<string, unknown>>)(evt as SubmitEvent);
    }

    const slotProps = computed(() => {
      return {
        meta: meta.value,
        errors: errors.value,
        values: values,
        isSubmitting: isSubmitting.value,
        submitCount: submitCount.value,
        validate,
        validateField,
        handleSubmit: handleScopedSlotSubmit,
        handleReset,
        submitForm,
        setErrors,
        setFieldError,
        setFieldValue,
        setValues,
        setFieldTouched,
        setTouched,
        resetForm,
      };
    });

    return function renderForm(this: any) {
      // FIXME: Hacky but cute way to expose some stuff to the rendered instance
      // getCurrentInstance doesn't work with render fns, it returns the wrong instance
      // we want to expose setFieldError and setErrors
      if (!('setErrors' in this)) {
        this.setFieldError = setFieldError;
        this.setErrors = setErrors;
        this.setFieldValue = setFieldValue;
        this.setValues = setValues;
        this.setFieldTouched = setFieldTouched;
        this.setTouched = setTouched;
        this.resetForm = resetForm;
        this.validate = validate;
        this.validateField = validateField;
      }

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
        // avoid resolving the form component as itself
        props.as === 'form' ? props.as : (resolveDynamicComponent(props.as) as string),
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
