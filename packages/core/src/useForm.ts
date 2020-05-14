import { computed, ref, Ref } from 'vue';
import { Flag, FormController, SubmissionHandler, GenericValidateFunction, FieldComposite } from './types';
import { unwrap } from './utils/refs';

interface FormOptions {
  validationSchema: Record<string, GenericValidateFunction>;
}

export function useForm(opts?: FormOptions) {
  const fields: Ref<any[]> = ref([]);
  const fieldsById: Record<string, any> = {};

  const activeFields = computed(() => {
    return fields.value.filter(field => !unwrap(field.disabled));
  });

  const values = computed(() => {
    return activeFields.value.reduce((acc: any, field: any) => {
      acc[field.name] = field.value;

      return acc;
    }, {});
  });

  const names = computed(() => {
    return fields.value.reduce((acc: any, field: any) => {
      acc[field.name] = field.name;

      return acc;
    }, {});
  });

  const controller: FormController = {
    register(field: FieldComposite) {
      const name = unwrap(field.name);
      // Set the rules for that field from the schema.
      if (opts?.validationSchema?.[name]) {
        field.__setRules(opts?.validationSchema[name]);
      }

      fields.value.push(field);
      fieldsById[name] = field;
    },
    fields: fieldsById,
    values,
    names,
  };

  const validate = async () => {
    const results = await Promise.all(
      activeFields.value.map((f: any) => {
        return f.validate();
      })
    );

    return results.every(r => r.valid);
  };

  const errors = computed(() => {
    return activeFields.value.reduce((acc: Record<string, string[]>, field) => {
      acc[field.name] = field.errorMessage;

      return acc;
    }, {});
  });

  const reset = () => {
    fields.value.forEach((f: any) => f.reset());
  };

  const meta = useFormMeta(fields);

  return {
    errors,
    meta,
    form: controller,
    values,
    validate,
    handleReset: reset,
    handleSubmit: (fn?: SubmissionHandler) => {
      return function submissionHandler(e: unknown) {
        if (e instanceof Event) {
          e.preventDefault();
          e.stopPropagation();
        }

        return validate().then(result => {
          if (result && typeof fn === 'function') {
            return fn(values.value);
          }
        });
      };
    },
  };
}

const MERGE_STRATEGIES: Record<Flag, 'every' | 'some'> = {
  valid: 'every',
  invalid: 'some',
  dirty: 'some',
  pristine: 'every',
  touched: 'some',
  untouched: 'every',
  pending: 'some',
  validated: 'every',
  changed: 'some',
  passed: 'every',
  failed: 'some',
};

function useFormMeta(fields: Ref<any[]>) {
  const flags: Flag[] = Object.keys(MERGE_STRATEGIES) as Flag[];

  return flags.reduce((acc, flag: Flag) => {
    acc[flag] = computed(() => {
      const mergeMethod = MERGE_STRATEGIES[flag];

      return fields.value[mergeMethod](field => field.meta[flag]);
    });

    return acc;
  }, {} as Record<Flag, Ref<boolean>>);
}
