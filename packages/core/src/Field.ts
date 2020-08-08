import { computed, h, defineComponent, nextTick } from 'vue';
import { getConfig } from './config';
import { useField } from './useField';
import { useRefsObjToComputed, normalizeChildren, isHTMLTag, hasCheckedAttr } from './utils';

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
      default: null,
    },
    immediate: {
      type: Boolean,
      default: false,
    },
    bails: {
      type: Boolean,
      default: () => getConfig().bails,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, ctx) {
    const fieldName = props.name;
    // FIXME: is this right?
    const disabled = computed(() => props.disabled as boolean);
    const rules = computed(() => props.rules);

    const {
      errors,
      value,
      errorMessage,
      validate: validateField,
      handleChange,
      onBlur,
      reset,
      meta,
      aria,
      checked,
    } = useField(fieldName, rules, {
      immediate: props.immediate as boolean,
      bails: props.bails as boolean,
      disabled,
      type: ctx.attrs.type as string,
      // Gets the initial value either from `value` prop/attr or `v-model` binding (modelValue)
      // For checkboxes and radio buttons it will always be the model value not the `value` attribute
      initialValue: hasCheckedAttr(ctx.attrs.type)
        ? ctx.attrs.modelValue
        : 'modelValue' in ctx.attrs
        ? ctx.attrs.modelValue
        : ctx.attrs.value,
      // Only for checkboxes and radio buttons
      valueProp: ctx.attrs.value,
    });

    // If there is a v-model applied on the component we need to emit the `update:modelValue` whenever the value binding changes
    const onChangeHandler =
      'modelValue' in ctx.attrs
        ? function handleChangeWithModel(e: any) {
            handleChange(e);
            ctx.emit('update:modelValue', value.value);
          }
        : handleChange;

    const unwrappedMeta = useRefsObjToComputed(meta);

    const slotProps = computed(() => {
      const fieldProps: Record<string, any> = {
        name: fieldName,
        disabled: props.disabled,
        onInput: onChangeHandler,
        onChange: onChangeHandler,
        'onUpdate:modelValue': onChangeHandler,
        onBlur: onBlur,
      };

      if (hasCheckedAttr(ctx.attrs.type) && checked) {
        fieldProps.checked = checked.value;
        // redundant for checkboxes and radio buttons
        delete fieldProps.onInput;
      } else {
        fieldProps.value = value.value;
      }

      return {
        field: fieldProps,
        aria: aria.value,
        meta: unwrappedMeta.value,
        errors: errors.value,
        errorMessage: errorMessage.value,
        validate: validateField,
        reset,
        handleChange: onChangeHandler,
      };
    });

    return () => {
      let tag = props.as;
      if (!props.as && !ctx.slots.default) {
        tag = 'input';
      }

      // Sync the model value with the inner field value if they mismatch
      // a simple string comparison is used here
      // TODO: Maybe use JSON.stringify for better accuracy?
      if ('modelValue' in ctx.attrs && String(ctx.attrs.modelValue) !== String(value.value)) {
        nextTick(() => {
          handleChange(ctx.attrs.modelValue as any);
        });
      }

      const children = normalizeChildren(ctx, slotProps.value);
      if (tag) {
        return h(
          tag,
          {
            ...ctx.attrs,
            ...slotProps.value.field,
            ...(isHTMLTag(tag) ? slotProps.value.aria : {}),
          },
          children
        );
      }

      return children;
    };
  },
});
