import { computed, inject, h, defineComponent } from 'vue';
import { getConfig } from './config';
import { FormController } from './types';
import { useField } from './useField';
import { useRefsObjToComputed, debounce, normalizeChildren, isHTMLTag } from './utils';

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
    debounce: {
      type: Number,
      default: 0,
    },
    customMessages: {
      type: Object,
      default: undefined,
    },
  },
  setup(props, ctx) {
    const fieldName = props.name;
    const $form = inject('$_veeForm', undefined) as FormController | undefined;
    // FIXME: is this right?
    const disabled = computed(() => props.disabled as boolean);
    const rules = computed(() => props.rules);

    const { errors, value, errorMessage, validate: validateField, handleChange, onBlur, reset, meta, aria } = useField(
      fieldName,
      rules,
      {
        form: $form,
        immediate: props.immediate as boolean,
        bails: props.bails as boolean,
        disabled,
      }
    );

    const limitedHandleChange = debounce(handleChange, props.debounce);
    const unwrappedMeta = useRefsObjToComputed(meta);

    const slotProps = computed(() => {
      return {
        field: {
          name: fieldName,
          disabled: props.disabled,
          onInput: limitedHandleChange,
          onChange: limitedHandleChange,
          'onUpdate:modelValue': limitedHandleChange,
          onBlur: onBlur,
          value: value.value,
        },
        aria: aria.value,
        meta: unwrappedMeta.value,
        errors: errors.value,
        errorMessage: errorMessage.value,
        validate: validateField,
        reset,
        handleChange: limitedHandleChange,
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
