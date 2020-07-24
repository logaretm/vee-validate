import { computed, ref, Ref, provide } from 'vue';
import type { useField } from './useField';
import {
  Flag,
  FormController,
  SubmissionHandler,
  GenericValidateFunction,
  SubmitEvent,
  ValidationResult,
} from './types';
import { unwrap } from './utils/refs';
import { isYupValidator } from './utils';

interface FormOptions {
  validationSchema?: Record<string, GenericValidateFunction | string | Record<string, any>>;
  initialValues?: Record<string, any>;
}

type FieldComposite = ReturnType<typeof useField>;

export function useForm(opts?: FormOptions) {
  const fields: Ref<any[]> = ref([]);
  const isSubmitting = ref(false);
  const fieldsById = computed(() => {
    return fields.value.reduce((acc, field) => {
      if (!acc[field.name]) {
        acc[field.name] = field;
        field.idx = -1;

        return acc;
      }

      if (!Array.isArray(acc[field.name])) {
        acc[field.name] = [acc[field.name]];
        field.idx = 0;
        return acc;
      }

      field.idx = acc[field.name].length;
      acc[field.name].push(field);

      return acc;
    }, {} as Record<string, any>);
  });

  const activeFields = computed(() => {
    return fields.value.filter(field => !unwrap(field.disabled));
  });

  // a private ref for all form values
  const _values = ref<Record<string, any>>({});
  // public ref for all active form values
  const values = computed(() => {
    return activeFields.value.reduce((acc: Record<string, any>, field) => {
      acc[field.name] = _values.value[field.name];

      return acc;
    }, {});
  });

  const controller: FormController = {
    register(field: FieldComposite) {
      const name = unwrap(field.name);
      // Set the initial value for that field
      if (opts?.initialValues?.[name]) {
        _values.value[name] = opts?.initialValues[name];
      }

      fields.value.push(field);
    },
    unregister(field: FieldComposite) {
      const idx = fields.value.indexOf(field);
      if (idx === -1) {
        return;
      }

      fields.value.splice(idx, 1);
      const fieldName = unwrap(field.name);
      if (field.idx === -1) {
        delete _values.value[fieldName];
      }

      // clean up the form value
      const valueIdx = _values.value[fieldName].indexOf(unwrap(field.valueProp));
      if (valueIdx === -1) {
        return;
      }

      _values.value[fieldName].splice(valueIdx, 1);
    },
    fields: fieldsById,
    values: _values,
    schema: opts?.validationSchema,
    validateSchema: isYupValidator(opts?.validationSchema)
      ? (shouldMutate = false) => {
          return validateYupSchema(controller, shouldMutate);
        }
      : undefined,
    setFieldValue(path: string, value: any) {
      const field = fieldsById.value[path];

      // singular inputs fields
      if (!Array.isArray(field)) {
        _values.value[path] = value;
        return;
      }

      // Radio buttons and other unknown group type inputs
      if (Array.isArray(field) && field[0].type !== 'checkbox') {
        _values.value[path] = value;
        // return;
      }
    },
  };

  const validate = async () => {
    if (controller.validateSchema) {
      return controller.validateSchema(true).then(results => {
        return Object.keys(results).every(r => !results[r].errors.length);
      });
    }

    const results = await Promise.all(
      activeFields.value.map((f: any) => {
        return f.validate();
      })
    );

    return results.every(r => !r.errors.length);
  };

  const errors = computed(() => {
    return activeFields.value.reduce((acc: Record<string, string>, field) => {
      acc[field.name] = field.errorMessage;

      return acc;
    }, {});
  });

  const handleReset = () => {
    fields.value.forEach((f: any) => f.reset());
  };

  const handleSubmit = (fn?: SubmissionHandler) => {
    return function submissionHandler(e: unknown) {
      if (e instanceof Event) {
        e.preventDefault();
        e.stopPropagation();
      }

      isSubmitting.value = true;
      return validate()
        .then(result => {
          if (result && typeof fn === 'function') {
            return fn(values.value, e as SubmitEvent);
          }
        })
        .then(
          () => {
            isSubmitting.value = false;
          },
          err => {
            isSubmitting.value = false;

            // re-throw the err so it doesn't go silent
            throw err;
          }
        );
    };
  };

  const submitForm = handleSubmit((_, e) => {
    if (e) {
      e.target.submit();
    }
  });

  const meta = useFormMeta(fields);

  provide('$_veeForm', controller);
  provide('$_veeFormErrors', errors);

  return {
    errors,
    meta,
    form: controller,
    values,
    validate,
    isSubmitting,
    handleReset,
    handleSubmit,
    submitForm,
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

async function validateYupSchema(
  form: FormController,
  shouldMutate = false
): Promise<Record<string, ValidationResult>> {
  const errors: any[] = await (form.schema as any)
    .validate(form.values.value, { abortEarly: false })
    .then(() => [])
    .catch((err: any) => {
      // Yup errors have a name prop one them.
      // https://github.com/jquense/yup#validationerrorerrors-string--arraystring-value-any-path-string
      if (err.name !== 'ValidationError') {
        throw err;
      }

      // list of aggregated errors
      return err.inner || [];
    });

  const fields = form.fields.value;
  const errorsByPath = errors.reduce((acc, err) => {
    acc[err.path] = err;

    return acc;
  }, {});

  // Aggregates the validation result
  const aggregatedResult = Object.keys(fields).reduce((result: Record<string, ValidationResult>, fieldId) => {
    const field = fields[fieldId];
    const messages = (errorsByPath[fieldId] || { errors: [] }).errors;
    const fieldResult = {
      errors: messages,
    };

    result[fieldId] = fieldResult;
    const isGroup = Array.isArray(field);
    const touched = isGroup ? field.some((f: any) => f.meta.validated) : field.meta.validated;
    if (!shouldMutate && !touched) {
      return result;
    }

    if (isGroup) {
      field.forEach((f: any) => f.setValidationState(fieldResult));

      return result;
    }

    field.setValidationState(fieldResult);

    return result;
  }, {});

  return aggregatedResult;
}
