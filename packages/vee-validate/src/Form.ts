import { h, defineComponent, toRef, resolveDynamicComponent, PropType, VNode, UnwrapRef } from 'vue';
import { useForm } from './useForm';
import { SubmissionHandler, InvalidSubmissionHandler } from './types';
import { isEvent, normalizeChildren } from './utils';
import { FormContext } from '.';

type FormSlotProps = UnwrapRef<
  Pick<
    FormContext,
    | 'meta'
    | 'errors'
    | 'values'
    | 'isSubmitting'
    | 'submitCount'
    | 'validate'
    | 'validateField'
    | 'handleReset'
    | 'submitForm'
    | 'setErrors'
    | 'setFieldError'
    | 'setFieldValue'
    | 'setValues'
    | 'setFieldTouched'
    | 'setTouched'
    | 'resetForm'
  >
> & {
  handleSubmit: (evt: Event | SubmissionHandler, onSubmit?: SubmissionHandler) => Promise<unknown>;
};

const FormImpl = defineComponent({
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
    onInvalidSubmit: {
      type: Function as PropType<InvalidSubmissionHandler>,
      default: undefined,
    },
    unsetValuesOnUnmount: {
      type: Boolean,
      default: true,
    },
  },
  setup(props, ctx) {
    const initialValues = toRef(props, 'initialValues');
    const validationSchema = toRef(props, 'validationSchema');

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
      validationSchema: validationSchema.value ? validationSchema : undefined,
      initialValues,
      initialErrors: props.initialErrors,
      initialTouched: props.initialTouched,
      validateOnMount: props.validateOnMount,
      unsetValuesOnUnmount: props.unsetValuesOnUnmount,
    });

    const onSubmit = props.onSubmit ? handleSubmit(props.onSubmit, props.onInvalidSubmit) : submitForm;
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

      return handleSubmit(onSuccess as SubmissionHandler<Record<string, unknown>>, props.onInvalidSubmit)(evt as Event);
    }

    function slotProps(): FormSlotProps {
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
    }

    // expose these functions and methods as part of public API
    ctx.expose({
      setFieldError,
      setErrors,
      setFieldValue,
      setValues,
      setFieldTouched,
      setTouched,
      resetForm,
      validate,
      validateField,
    });

    return function renderForm() {
      // avoid resolving the form component as itself
      const tag = props.as === 'form' ? props.as : (resolveDynamicComponent(props.as) as string);
      const children = normalizeChildren(tag, ctx, slotProps as any);

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
        tag,
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

export const Form = FormImpl as typeof FormImpl & {
  new (): {
    setFieldError: FormContext['setFieldError'];
    setErrors: FormContext['setErrors'];
    setFieldValue: FormContext['setFieldValue'];
    setValues: FormContext['setValues'];
    setFieldTouched: FormContext['setFieldTouched'];
    setTouched: FormContext['setTouched'];
    resetForm: FormContext['resetForm'];
    validate: FormContext['validate'];
    validateField: FormContext['validateField'];
    $slots: {
      default: (arg: FormSlotProps) => VNode[];
    };
  };
};
