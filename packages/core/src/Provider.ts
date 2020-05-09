import { ref, computed, inject, h, defineComponent } from 'vue';
import { normalizeChildren } from './utils/vnode';
import { getConfig } from './config';
import { Flag, ValidationFlags, FormController } from './types';
import { useField } from './useField';

export const ValidationProvider = defineComponent({
  name: 'ValidationProvider',
  props: {
    vid: {
      type: String,
      default: '',
    },
    as: {
      type: [String, Object],
      default: undefined,
    },
    name: {
      type: String,
      default: null,
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
    skipIfEmpty: {
      type: Boolean,
      default: () => getConfig().skipOptional,
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
    const fieldName = ref(props.name || '');
    const $form = inject('$_veeObserver', undefined) as FormController | undefined;
    const {
      errors,
      failedRules,
      // value,
      errorMessage,
      validate: validateField,
      handleChange,
      onBlur,
      reset,
      ...flags
    } = useField(fieldName, props.rules, {
      form: $form,
    });

    const unwrappedFlags = computed(() => {
      return Object.keys(flags).reduce((acc, key) => {
        acc[key] = flags[key as Flag].value;

        return acc;
      }, {} as ValidationFlags);
    });

    // const resolvedRules = {};

    // const normalizedRules = computed(() => {
    //   return normalizeRules(props.rules);
    // });
    // const isRequired = computed(() => {
    //   const rules = { ...resolvedRules, ...normalizedRules.value };

    //   const isRequired = Object.keys(rules).some(RuleContainer.isRequireRule);
    //   flags.required.value = !!isRequired;

    //   return isRequired;
    // });

    const slotProps = computed(() => {
      return {
        field: {
          name: fieldName.value,
          onInput: handleChange,
          onChange: handleChange,
          'onUpdate:modelValue': handleChange,
          onBlur: onBlur,
        },
        // isRequired: isRequired.value,
        flags: unwrappedFlags.value,
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
