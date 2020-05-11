import { computed, ref, Ref } from 'vue';
import { Flag, FormController, SubmissionHandler, GenericValidateFunction } from './types';
import { unwrap } from './utils/refs';

const mergeStrategies: Record<Flag, 'every' | 'some'> = {
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
  required: 'some',
};

function computeMeta(fields: Ref<any[]>) {
  const flags: Flag[] = Object.keys(mergeStrategies) as Flag[];

  return flags.reduce((acc, flag: Flag) => {
    acc[flag] = computed(() => {
      const mergeMethod = mergeStrategies[flag];
      return fields.value[mergeMethod](field => field.meta[flag]);
    });

    return acc;
  }, {} as Record<Flag, Ref<boolean>>);
}

interface FormOptions {
  validationSchema: Record<string, GenericValidateFunction>;
}

export function useForm(opts?: FormOptions) {
  const fields: Ref<any[]> = ref([]);
  const fieldsById: Record<string, any> = {};
  const values = computed(() => {
    return fields.value.reduce((acc: any, field: any) => {
      acc[field.vid] = field.value;

      return acc;
    }, {});
  });

  const names = computed(() => {
    return fields.value.reduce((acc: any, field: any) => {
      acc[field.vid] = field.vid;

      return acc;
    }, {});
  });

  const controller: FormController = {
    register(field) {
      const vid = unwrap(field.vid);
      // Set the rules for that field from the schema.
      if (opts?.validationSchema[vid]) {
        field.__setRules(opts?.validationSchema[vid]);
      }

      fields.value.push(field);
      fieldsById[vid] = field;
    },
    fields: fieldsById,
    values,
    names,
  };

  const validate = async () => {
    const results = await Promise.all(
      fields.value.map((f: any) => {
        return f.validate();
      })
    );

    return results.every(r => r.valid);
  };

  const errors = computed(() => {
    return fields.value.reduce((acc: Record<string, string[]>, field) => {
      acc[field.vid] = field.errorMessage;

      return acc;
    }, {});
  });

  const reset = () => {
    fields.value.forEach((f: any) => f.reset());
  };

  return {
    errors,
    meta: computeMeta(fields),
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
