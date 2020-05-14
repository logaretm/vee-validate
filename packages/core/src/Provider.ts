import { computed, inject, h, defineComponent } from 'vue';
import { normalizeChildren } from './utils/vnode';
import { getConfig } from './config';
import { FormController } from './types';
import { useField } from './useField';
import { useRefsObjToComputed } from './utils';

export const ValidationProvider = defineComponent({
  name: 'ValidationProvider',
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
    customMessages: {
      type: Object,
      default: undefined,
    },
  },
  setup(props, ctx) {
    const fieldName = props.name;
    const $form = inject('$_veeObserver', undefined) as FormController | undefined;
    // FIXME: is this right?
    const disabled = computed(() => props.disabled as boolean);
    const {
      errors,
      failedRules,
      // value,
      errorMessage,
      validate: validateField,
      handleChange,
      onBlur,
      reset,
      meta,
    } = useField(fieldName, props.rules, {
      form: $form,
      immediate: props.immediate as boolean,
      bails: props.bails as boolean,
      disabled,
    });

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
        },
        meta: unwrappedMeta.value,
        errors: errors.value,
        errorMessage: errorMessage.value,
        failedRules: failedRules.value,
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
          },
          children
        );
      }

      return children;
    };
  },
});
