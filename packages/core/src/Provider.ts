import { ref, computed, SetupContext, inject } from 'vue';
import { normalizeRules } from './utils/rules';
import { normalizeChildren } from './utils/vnode';
import { isNullOrUndefined } from './utils';
import { getConfig } from './config';
import { RuleContainer } from './extend';
import { Flag, ValidationFlags, FormController } from './types';
import { useField } from './useField';

interface ProviderProps {
  vid: string | undefined;
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
      default: ''
    },
    name: {
      type: String,
      default: null
    },
    rules: {
      type: [Object, String],
      default: null
    },
    immediate: {
      type: Boolean,
      default: false
    },
    bails: {
      type: Boolean,
      default: () => getConfig().bails
    },
    skipIfEmpty: {
      type: Boolean,
      default: () => getConfig().skipOptional
    },
    disabled: {
      type: Boolean,
      default: false
    },
    customMessages: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  setup(props: ProviderProps, ctx: SetupContext) {
    const fieldName = ref(props.name || '');
    const $form = inject('$_veeObserver', undefined) as FormController | undefined;
    const { errors, failedRules, value, validate: validateField, handleChange, onBlur, reset, ...flags } = useField(
      fieldName,
      props.rules,
      {
        form: $form
      }
    );

    // let initialValue: any;
    // eslint-disable-next-line prefer-const
    // let initialized = false;
    const id = '';
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

    const classes = computed(() => {
      const names = getConfig().classes;
      const acc: Record<string, boolean> = {};
      const keys = Object.keys(flags);
      const length = keys.length;

      for (let i = 0; i < length; i++) {
        const flag = keys[i];
        const className = (names && names[flag]) || flag;
        const value = flags[flag as Flag].value;
        if (isNullOrUndefined(value)) {
          continue;
        }

        if ((flag === 'valid' || flag === 'invalid') && !flags.validated) {
          continue;
        }

        if (typeof className === 'string') {
          acc[className] = value;
        } else if (Array.isArray(className)) {
          className.forEach(cls => {
            acc[cls] = value;
          });
        }
      }

      return acc;
    });

    const slotProps = computed(() => {
      return {
        flags: unwrappedFlags.value,
        errors: errors.value,
        classes: classes.value,
        failedRules: failedRules.value,
        reset,
        validate: validateField,
        handleChange,
        ariaInput: {
          'aria-invalid': flags.invalid ? 'true' : 'false',
          'aria-required': isRequired.value ? 'true' : 'false',
          'aria-errormessage': `vee_${id}`
        },
        ariaMsg: {
          id: `vee_${id}`,
          'aria-live': errors.value.length ? 'assertive' : 'off'
        }
      };
    });

    return () => {
      // updateRenderingContextRefs();
      const children = normalizeChildren(ctx, slotProps.value);

      return children;
    };
  }
};
