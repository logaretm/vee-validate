import { klona as deepCopy } from 'klona/full';
import { defineComponent, h, PropType, resolveDynamicComponent, toRef, UnwrapRef, VNode } from 'vue';
import { FormContext, FormErrors, FormMeta, GenericObject, InvalidSubmissionHandler, SubmissionHandler } from './types';
import { useForm } from './useForm';
import { isEvent, isFormSubmitEvent, normalizeChildren } from './utils';

export type FormSlotProps = UnwrapRef<
  Pick<
    FormContext,
    | 'meta'
    | 'errors'
    | 'errorBag'
    | 'values'
    | 'isSubmitting'
    | 'isValidating'
    | 'submitCount'
    | 'validate'
    | 'validateField'
    | 'handleReset'
    | 'setErrors'
    | 'setFieldError'
    | 'setFieldValue'
    | 'setValues'
    | 'setFieldTouched'
    | 'setTouched'
    | 'resetForm'
    | 'resetField'
    | 'controlledValues'
  >
> & {
  handleSubmit: (evt: Event | SubmissionHandler, onSubmit?: SubmissionHandler) => Promise<unknown>;
  submitForm(evt?: Event): void;
  getValues<TValues extends GenericObject = GenericObject>(): TValues;
  getMeta<TValues extends GenericObject = GenericObject>(): FormMeta<TValues>;
  getErrors<TValues extends GenericObject = GenericObject>(): FormErrors<TValues>;
};

const FormImpl = /** #__PURE__ */ defineComponent({
  name: 'Form',
  inheritAttrs: false,
  props: {
    as: {
      type: null as unknown as PropType<string | null>,
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
      type: Function as PropType<SubmissionHandler<GenericObject>>,
      default: undefined,
    },
    onInvalidSubmit: {
      type: Function as PropType<InvalidSubmissionHandler>,
      default: undefined,
    },
    keepValues: {
      type: Boolean,
      default: false,
    },
    name: {
      type: String,
      default: 'Form',
    },
  },
  setup(props, ctx) {
    const validationSchema = toRef(props, 'validationSchema');
    const keepValues = toRef(props, 'keepValues');

    const {
      errors,
      errorBag,
      values,
      meta,
      isSubmitting,
      isValidating,
      submitCount,
      controlledValues,
      validate,
      validateField,
      handleReset,
      resetForm,
      handleSubmit,
      setErrors,
      setFieldError,
      setFieldValue,
      setValues,
      setFieldTouched,
      setTouched,
      resetField,
    } = useForm({
      validationSchema: validationSchema.value ? validationSchema : undefined,
      initialValues: props.initialValues,
      initialErrors: props.initialErrors,
      initialTouched: props.initialTouched,
      validateOnMount: props.validateOnMount,
      keepValuesOnUnmount: keepValues,
      name: props.name,
    });

    const submitForm = handleSubmit((_, { evt }) => {
      if (isFormSubmitEvent(evt)) {
        evt.target.submit();
      }
    }, props.onInvalidSubmit);

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

    function getValues<TValues extends GenericObject = GenericObject>() {
      return deepCopy(values) as TValues;
    }

    function getMeta<TValues extends GenericObject = GenericObject>() {
      return deepCopy(meta.value) as FormMeta<TValues>;
    }

    function getErrors<TValues extends GenericObject = GenericObject>() {
      return deepCopy(errors.value) as FormErrors<TValues>;
    }

    function slotProps(): FormSlotProps {
      return {
        meta: meta.value,
        errors: errors.value,
        errorBag: errorBag.value,
        values,
        isSubmitting: isSubmitting.value,
        isValidating: isValidating.value,
        submitCount: submitCount.value,
        controlledValues: controlledValues.value,
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
        resetField,
        getValues,
        getMeta,
        getErrors,
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
      resetField,
      getValues,
      getMeta,
      getErrors,
      values,
      meta,
      errors,
    });

    return function renderForm() {
      // avoid resolving the form component as itself
      const tag = props.as === 'form' ? props.as : !props.as ? null : (resolveDynamicComponent(props.as) as string);
      const children = normalizeChildren(tag, ctx, slotProps as any);

      if (!tag) {
        return children;
      }

      // Attributes to add on a native `form` tag
      const formAttrs =
        tag === 'form'
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
        children,
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
    resetField: FormContext['resetField'];
    validate: FormContext['validate'];
    validateField: FormContext['validateField'];
    getValues: FormSlotProps['getValues'];
    getMeta: FormSlotProps['getMeta'];
    getErrors: FormSlotProps['getErrors'];
    meta: FormSlotProps['meta'];
    values: FormSlotProps['values'];
    errors: FormSlotProps['errors'];
    $slots: {
      default: (arg: FormSlotProps) => VNode[];
    };
  };
};
