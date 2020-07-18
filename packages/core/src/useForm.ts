import { computed, ref, Ref } from 'vue';
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
      acc[field.name] = field;

      return acc;
    }, {} as Record<string, any>);
  });

  const activeFields = computed(() => {
    return fields.value.filter(field => !unwrap(field.disabled));
  });

  const values = computed(() => {
    return activeFields.value.reduce((acc: any, field) => {
      acc[field.name] = field.value;

      return acc;
    }, {});
  });

  const controller: FormController = {
    register(field: FieldComposite) {
      const name = unwrap(field.name);
      // Set the initial value for that field
      if (opts?.initialValues?.[name]) {
        field.value.value = opts?.initialValues[name];
      }

      fields.value.push(field);
    },
    fields: fieldsById,
    values,
    schema: opts?.validationSchema,
    validateSchema: isYupValidator(opts?.validationSchema)
      ? (shouldMutate = false) => {
          return validateYupSchema(controller, shouldMutate);
        }
      : undefined,
  };

  const validate = async () => {
    if (controller.validateSchema) {
      return controller.validateSchema(true).then(results => {
        return Object.keys(results).every(r => results[r].valid);
      });
    }

    const results = await Promise.all(
      activeFields.value.map((f: any) => {
        return f.validate();
      })
    );

    return results.every(r => r.valid);
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
        .then(() => {
          isSubmitting.value = false;
        });
    };
  };

  const submitForm = handleSubmit((_, e) => {
    if (e) {
      e.target.submit();
    }
  });

  const meta = useFormMeta(fields);

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
      valid: !messages.length,
    };

    result[fieldId] = fieldResult;
    if (shouldMutate || field.meta.validated) {
      field.setValidationState(fieldResult);
    }

    return result;
  }, {});

  return aggregatedResult;
}
