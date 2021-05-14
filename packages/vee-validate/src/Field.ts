import { h, defineComponent, toRef, SetupContext, resolveDynamicComponent, computed, watch } from 'vue';
import { getConfig } from './config';
import { useField } from './useField';
import { normalizeChildren, hasCheckedAttr, shouldHaveValueBinding, isPropPresent } from './utils';
import { toNumber } from '../../shared';
import { EMPTY_VALUE } from './symbols';

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
      type: [Object, String, Function],
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
      default: EMPTY_VALUE,
    },
    modelModifiers: {
      type: null,
      default: () => ({}),
    },
  },
  emits: ['update:modelValue'],
  setup(props, ctx) {
    const rules = toRef(props, 'rules');
    const name = toRef(props, 'name');
    const label = toRef(props, 'label');
    const uncheckedValue = toRef(props, 'uncheckedValue');

    const {
      errors,
      value,
      errorMessage,
      validate: validateField,
      handleChange,
      handleBlur,
      handleInput,
      setTouched,
      resetField,
      handleReset,
      meta,
      checked,
      setErrors,
    } = useField(name, rules, {
      validateOnMount: props.validateOnMount,
      bails: props.bails,
      type: ctx.attrs.type as string,
      initialValue: resolveInitialValue(props, ctx),
      // Only for checkboxes and radio buttons
      checkedValue: ctx.attrs.value,
      uncheckedValue,
      label,
      validateOnValueUpdate: false,
    });

    // If there is a v-model applied on the component we need to emit the `update:modelValue` whenever the value binding changes
    const onChangeHandler = isPropPresent(props, 'modelValue')
      ? function handleChangeWithModel(e: unknown, shouldValidate = true) {
          handleChange(e, shouldValidate);
          ctx.emit('update:modelValue', value.value);
        }
      : handleChange;

    const onInputHandler = isPropPresent(props, 'modelValue')
      ? function handleChangeWithModel(e: any) {
          handleInput(e);
          ctx.emit('update:modelValue', value.value);
        }
      : handleInput;

    const fieldProps = computed(() => {
      const { validateOnInput, validateOnChange, validateOnBlur, validateOnModelUpdate } = resolveValidationTriggers(
        props
      );
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

    if (isPropPresent(props, 'modelValue')) {
      const modelValue = toRef(props, 'modelValue');
      watch(modelValue, newModelValue => {
        if (newModelValue !== applyModifiers(value.value, props.modelModifiers)) {
          value.value = newModelValue;
          validateField();
        }
      });
    }

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

function resolveValidationTriggers(props: ValidationTriggersProps) {
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
