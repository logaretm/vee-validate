import { computed, h, defineComponent } from 'vue';
import { getConfig } from './config';
import { useField } from './useField';
import { useRefsObjToComputed, normalizeChildren, isHTMLTag, unwrap, hasCheckedAttr } from './utils';

export const Field = defineComponent({
  name: 'Field',
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
      valueProp: ctx.attrs.value,
    });

    const unwrappedMeta = useRefsObjToComputed(meta);

    const slotProps = computed(() => {
      const fieldProps: Record<string, any> = {
        name: fieldName,
        disabled: props.disabled,
        onInput: handleChange,
        onChange: handleChange,
        'onUpdate:modelValue': handleChange,
        onBlur: onBlur,
      };

      if (hasCheckedAttr(ctx.attrs.type as string) && checked) {
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
        handleChange,
      };
    });

    return () => {
      let tag = props.as;
      if (!props.as && !ctx.slots.default) {
        tag = 'input';
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
