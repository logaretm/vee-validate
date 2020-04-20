import { computed, ref, Ref, isRef } from 'vue';
import { Flag, FormController } from './types';

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

function computeFlags(fields: Ref<any[]>) {
  const flags: Flag[] = Object.keys(mergeStrategies) as Flag[];

  return flags.reduce((acc, flag: Flag) => {
    acc[flag] = computed(() => {
      return fields.value[mergeStrategies[flag]](field => field[flag]);
    });

    return acc;
  }, {} as Record<Flag, Ref<boolean>>);
}

interface FormComposite {
  form: FormController;
  errors: Ref<Record<string, string[]>>;
  reset: () => void;
  handleSubmit: (fn: Function) => Promise<any>;
  validate: () => Promise<boolean>;
}

export function useForm(): FormComposite {
  const fields: Ref<any[]> = ref([]);
  const fieldsById: Record<string, any> = {};
  const values = computed(() => {
    return fields.value.reduce((acc: any, field: any) => {
      acc[isRef(field.vid) ? field.vid.value : field.vid] = field.value;

      return acc;
    }, {});
  });

  const names = computed(() => {
    return fields.value.reduce((acc: any, field: any) => {
      acc[isRef(field.vid) ? field.vid.value : field.vid] = field.vid;

      return acc;
    }, {});
  });

  const controller: FormController = {
    register(field) {
      fields.value.push(field);
      fieldsById[isRef(field.vid) ? field.vid.value : field.vid] = field;
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
      acc[isRef(field.vid) ? field.vid.value : field.vid] = field.errors.value;

      return acc;
    }, {});
  });

  const reset = () => {
    fields.value.forEach((f: any) => f.reset());
  };

  return {
    errors,
    ...computeFlags(fields),
    form: controller,
    validate,
    reset,
    handleSubmit: (fn: Function) => {
      return validate().then(result => {
        if (result && typeof fn === 'function') {
          return fn();
        }
      });
    },
  };
}
