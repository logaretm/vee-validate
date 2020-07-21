import { computed, h, defineComponent } from 'vue';
import { getConfig } from './config';
import { useField } from './useField';
import { useRefsObjToComputed, normalizeChildren, isHTMLTag } from './utils';

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

    const { errors, value, errorMessage, validate: validateField, handleChange, onBlur, reset, meta, aria } = useField(
      fieldName,
      rules,
      {
        immediate: props.immediate as boolean,
        bails: props.bails as boolean,
        disabled,
      }
    );

    const unwrappedMeta = useRefsObjToComputed(meta);

    const slotProps = computed(() => {
      return {
        field: {
          name: fieldName,
          disabled: props.disabled,
          onInput: handleChange,
          onChange: handleChange,
          'onUpdate:modelValue': handleChange,
          onBlur: onBlur,
          value: value.value,
        },
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
      const children = normalizeChildren(ctx, slotProps.value);
      if (props.as) {
        return h(
          props.as,
          {
            ...ctx.attrs,
            ...slotProps.value.field,
            ...(isHTMLTag(props.as) ? slotProps.value.aria : {}),
          },
          children
        );
      }

      return children;
    };
  },
});
