import { h, defineComponent, toRef, SetupContext, resolveDynamicComponent, computed, PropType, VNode } from 'vue';
import { getConfig } from './config';
import { RuleExpression, useField } from './useField';
import { normalizeChildren, hasCheckedAttr, shouldHaveValueBinding, isPropPresent, normalizeEventValue } from './utils';
import { IS_ABSENT } from './symbols';
import { FieldMeta } from './types';
import { FieldContext } from '.';

interface ValidationTriggersProps {
  validateOnMount: boolean;
  validateOnBlur: boolean;
  validateOnChange: boolean;
  validateOnInput: boolean;
  validateOnModelUpdate: boolean;
}

interface FieldBindingObject<TValue = unknown> {
  name: string;
  onBlur: (e: Event) => unknown;
  onInput: (e: Event) => unknown;
  onChange: (e: Event) => unknown;
  'onUpdate:modelValue'?: ((e: TValue) => unknown) | undefined;
  value?: unknown;
  checked?: boolean;
}

interface FieldSlotProps<TValue = unknown>
  extends Pick<
    FieldContext,
    'validate' | 'resetField' | 'handleChange' | 'handleReset' | 'handleBlur' | 'setTouched' | 'setErrors'
  > {
  field: FieldBindingObject<TValue>;
  value: TValue;
  meta: FieldMeta<TValue>;
  errors: string[];
  errorMessage: string | undefined;
  handleInput: FieldContext['handleChange'];
}

const FieldImpl = defineComponent({
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
    keepValue: {
      type: Boolean,
      default: undefined,
    },
  },
  setup(props, ctx) {
    const rules = toRef(props, 'rules');
    const name = toRef(props, 'name');
    const label = toRef(props, 'label');
    const uncheckedValue = toRef(props, 'uncheckedValue');
    const keepValue = toRef(props, 'keepValue');

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
      keepValueOnUnmount: keepValue,
    });

    // If there is a v-model applied on the component we need to emit the `update:modelValue` whenever the value binding changes
    const onChangeHandler = function handleChangeWithModel(e: unknown, shouldValidate = true) {
      handleChange(e, shouldValidate);
      ctx.emit('update:modelValue', value.value);
    };

    const handleInput = (e: any) => {
      if (!hasCheckedAttr(ctx.attrs.type)) {
        value.value = normalizeEventValue(e);
      }
    };

    const onInputHandler = function handleInputWithModel(e: any) {
      handleInput(e);
      ctx.emit('update:modelValue', value.value);
    };

    const fieldProps = computed(() => {
      const { validateOnInput, validateOnChange, validateOnBlur, validateOnModelUpdate } =
        resolveValidationTriggers(props);
      const baseOnBlur: any = [handleBlur, ctx.attrs.onBlur, validateOnBlur ? validateField : undefined].filter(
        Boolean
      );
      const baseOnInput: any = [(e: unknown) => onChangeHandler(e, validateOnInput), ctx.attrs.onInput].filter(Boolean);
      const baseOnChange: any = [(e: unknown) => onChangeHandler(e, validateOnChange), ctx.attrs.onChange].filter(
        Boolean
      );

      const attrs: FieldBindingObject<unknown> = {
        name: props.name,
        onBlur: baseOnBlur,
        onInput: baseOnInput,
        onChange: baseOnChange,
      };

      attrs['onUpdate:modelValue'] = e => onChangeHandler(e, validateOnModelUpdate);

      if (hasCheckedAttr(ctx.attrs.type) && checked) {
        attrs.checked = checked.value;
      }

      const tag = resolveTag(props, ctx);
      if (shouldHaveValueBinding(tag, ctx.attrs)) {
        attrs.value = value.value;
      }

      return attrs;
    });

    function slotProps(): FieldSlotProps {
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
      const children = normalizeChildren(tag, ctx, slotProps as any);

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

function resolveInitialValue(props: Record<string, unknown>, ctx: SetupContext<any>) {
  // Gets the initial value either from `value` prop/attr or `v-model` binding (modelValue)
  // For checkboxes and radio buttons it will always be the model value not the `value` attribute
  if (!hasCheckedAttr(ctx.attrs.type)) {
    return isPropPresent(props, 'modelValue') ? props.modelValue : ctx.attrs.value;
  }

  return isPropPresent(props, 'modelValue') ? props.modelValue : undefined;
}

export const Field = FieldImpl as typeof FieldImpl & {
  new (): {
    setErrors: FieldContext['setErrors'];
    setTouched: FieldContext['setTouched'];
    reset: FieldContext['resetField'];
    validate: FieldContext['validate'];
    handleChange: FieldContext['handleChange'];
    $slots: {
      default: (arg: FieldSlotProps<unknown>) => VNode[];
    };
  };
};
