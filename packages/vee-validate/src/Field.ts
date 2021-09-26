import { h, defineComponent, toRef, SetupContext, resolveDynamicComponent, computed, watch, PropType } from 'vue';
import { getConfig } from './config';
import { RuleExpression, useField } from './useField';
import { normalizeChildren, hasCheckedAttr, shouldHaveValueBinding, isPropPresent, normalizeEventValue } from './utils';
import { toNumber } from '../../shared';
import { IS_ABSENT } from './symbols';

interface ValidationTriggersProps {
  validateOnMount: boolean;
  validateOnBlur: boolean;
  validateOnChange: boolean;
  validateOnInput: boolean;
  validateOnModelUpdate: boolean;
}

export const Field = defineComponent({
  name: 'Field',
  inheritAttrs: false,
  props: {
    as: {
      type: [String, Object],
      default: undefined,
    },
    name: {
      type: String,
      required: true,
    },
    rules: {
      type: [Object, String, Function] as PropType<RuleExpression<unknown>>,
      default: undefined,
    },
    validateOnMount: {
      type: Boolean,
      default: false,
    },
    validateOnBlur: {
      type: Boolean,
      default: undefined,
    },
    validateOnChange: {
      type: Boolean,
      default: undefined,
    },
    validateOnInput: {
      type: Boolean,
      default: undefined,
    },
    validateOnModelUpdate: {
      type: Boolean,
      default: undefined,
    },
    bails: {
      type: Boolean,
      default: () => getConfig().bails,
    },
    label: {
      type: String,
      default: undefined,
    },
    uncheckedValue: {
      type: null,
      default: undefined,
    },
    modelValue: {
      type: null,
      default: IS_ABSENT,
    },
    modelModifiers: {
      type: null,
      default: () => ({}),
    },
    'onUpdate:modelValue': {
      type: null as unknown as PropType<((e: any) => unknown) | undefined>,
      default: undefined,
    },
    standalone: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, ctx) {
    const rules = toRef(props, 'rules');
    const name = toRef(props, 'name');
    const label = toRef(props, 'label');
    const uncheckedValue = toRef(props, 'uncheckedValue');
    const hasModelEvents = isPropPresent(props, 'onUpdate:modelValue');

    const {
      errors,
      value,
      errorMessage,
      validate: validateField,
      handleChange,
      handleBlur,
      setTouched,
      resetField,
      handleReset,
      meta,
      checked,
      setErrors,
    } = useField(name, rules, {
      validateOnMount: props.validateOnMount,
      bails: props.bails,
      standalone: props.standalone,
      type: ctx.attrs.type as string,
      initialValue: resolveInitialValue(props, ctx),
      // Only for checkboxes and radio buttons
      checkedValue: ctx.attrs.value,
      uncheckedValue,
      label,
      validateOnValueUpdate: false,
    });

    // If there is a v-model applied on the component we need to emit the `update:modelValue` whenever the value binding changes
    const onChangeHandler = hasModelEvents
      ? function handleChangeWithModel(e: unknown, shouldValidate = true) {
          handleChange(e, shouldValidate);
          ctx.emit('update:modelValue', value.value);
        }
      : handleChange;

    const handleInput = (e: any) => {
      if (!hasCheckedAttr(ctx.attrs.type)) {
        value.value = normalizeEventValue(e);
      }
    };

    const onInputHandler = hasModelEvents
      ? function handleInputWithModel(e: any) {
          handleInput(e);
          ctx.emit('update:modelValue', value.value);
        }
      : handleInput;

    const fieldProps = computed(() => {
      const { validateOnInput, validateOnChange, validateOnBlur, validateOnModelUpdate } =
        resolveValidationTriggers(props);
      const baseOnBlur = [handleBlur, ctx.attrs.onBlur, validateOnBlur ? validateField : undefined].filter(Boolean);
      const baseOnInput = [(e: unknown) => onChangeHandler(e, validateOnInput), ctx.attrs.onInput].filter(Boolean);
      const baseOnChange = [(e: unknown) => onChangeHandler(e, validateOnChange), ctx.attrs.onChange].filter(Boolean);

      const attrs: Record<string, any> = {
        name: props.name,
        onBlur: baseOnBlur,
        onInput: baseOnInput,
        onChange: baseOnChange,
      };

      if (validateOnModelUpdate) {
        attrs['onUpdate:modelValue'] = [onChangeHandler];
      }

      if (hasCheckedAttr(ctx.attrs.type) && checked) {
        attrs.checked = checked.value;
      } else {
        attrs.value = value.value;
      }

      const tag = resolveTag(props, ctx);
      if (shouldHaveValueBinding(tag, ctx.attrs)) {
        delete attrs.value;
      }

      return attrs;
    });

    const modelValue = toRef(props, 'modelValue');
    watch(modelValue, newModelValue => {
      // Don't attempt to sync absent values
      if ((newModelValue as any) === IS_ABSENT && value.value === undefined) {
        return;
      }

      if (newModelValue !== applyModifiers(value.value, props.modelModifiers)) {
        value.value = (newModelValue as any) === IS_ABSENT ? undefined : newModelValue;
        validateField();
      }
    });

    function slotProps() {
      return {
        field: fieldProps.value,
        value: value.value,
        meta,
        errors: errors.value,
        errorMessage: errorMessage.value,
        validate: validateField,
        resetField,
        handleChange: onChangeHandler,
        handleInput: onInputHandler,
        handleReset,
        handleBlur,
        setTouched,
        setErrors,
      };
    }

    ctx.expose({
      setErrors,
      setTouched,
      reset: resetField,
      validate: validateField,
      handleChange,
    });

    return () => {
      const tag = resolveDynamicComponent(resolveTag(props, ctx)) as string;
      const children = normalizeChildren(tag, ctx, slotProps);

      if (tag) {
        return h(
          tag,
          {
            ...ctx.attrs,
            ...fieldProps.value,
          },
          children
        );
      }

      return children;
    };
  },
});

function resolveTag(props: Record<string, any>, ctx: SetupContext<any>) {
  let tag: string = props.as || '';

  if (!props.as && !ctx.slots.default) {
    tag = 'input';
  }

  return tag;
}

function resolveValidationTriggers(props: Partial<ValidationTriggersProps>) {
  const { validateOnInput, validateOnChange, validateOnBlur, validateOnModelUpdate } = getConfig();

  return {
    validateOnInput: props.validateOnInput ?? validateOnInput,
    validateOnChange: props.validateOnChange ?? validateOnChange,
    validateOnBlur: props.validateOnBlur ?? validateOnBlur,
    validateOnModelUpdate: props.validateOnModelUpdate ?? validateOnModelUpdate,
  };
}

function applyModifiers(value: unknown, modifiers: Record<string, boolean>) {
  if (modifiers.number) {
    return toNumber(value as string);
  }

  return value;
}

function resolveInitialValue(props: Record<string, unknown>, ctx: SetupContext<any>) {
  // Gets the initial value either from `value` prop/attr or `v-model` binding (modelValue)
  // For checkboxes and radio buttons it will always be the model value not the `value` attribute
  if (!hasCheckedAttr(ctx.attrs.type)) {
    return isPropPresent(props, 'modelValue') ? props.modelValue : ctx.attrs.value;
  }

  return isPropPresent(props, 'modelValue') ? props.modelValue : undefined;
}
