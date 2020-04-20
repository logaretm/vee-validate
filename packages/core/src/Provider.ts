import { ref, computed, SetupContext, inject, h } from 'vue';
import { normalizeRules } from './utils/rules';
import { normalizeChildren } from './utils/vnode';
import { getConfig } from './config';
import { RuleContainer } from './extend';
import { Flag, ValidationFlags, FormController } from './types';
import { useField } from './useField';

interface ProviderProps {
  vid: string | undefined;
  as: string | undefined;
  name: string | undefined;
  mode: string | Function;
  rules: Record<string, any> | string;
  immediate: boolean;
  bails: boolean;
  skipIfEmpty: boolean;
  debounce: number;
  disabled: boolean;
  customMessages: Record<string, string>;
}

export const ValidationProvider: any = {
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
      type: [Object, String],
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
      default() {
        return {};
      },
    },
  },
  setup(props: ProviderProps, ctx: SetupContext) {
    const fieldName = ref(props.name || '');
    const $form = inject('$_veeObserver', undefined) as FormController | undefined;
    const {
      errors,
      failedRules,
      value,
      errorMessage,
      validate: validateField,
      handleChange,
      onBlur,
      reset,
      ...flags
    } = useField(fieldName, props.rules, {
      form: $form,
    });

    const resolvedRules = {};

    const normalizedRules = computed(() => {
      return normalizeRules(props.rules);
    });

    const unwrappedFlags = computed(() => {
      return Object.keys(flags).reduce((acc, key) => {
        acc[key] = flags[key as Flag].value;

        return acc;
      }, {} as ValidationFlags);
    });

    const isRequired = computed(() => {
      const rules = { ...resolvedRules, ...normalizedRules.value };

      const isRequired = Object.keys(rules).some(RuleContainer.isRequireRule);
      flags.required.value = !!isRequired;

      return isRequired;
    });

    const slotProps = computed(() => {
      return {
        field: {
          name: fieldName.value,
          onInput: handleChange,
          onChange: handleChange,
          'onUpdate:modelValue': handleChange,
          onBlur: onBlur,
        },
        isRequired: isRequired.value,
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
};
