import { computed, ref, Ref, provide, reactive, onMounted } from 'vue';
import type { ValidationError } from 'yup';
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
import { getFromPath, isYupValidator, setInPath, unsetPath } from './utils';
import { FormErrorsSymbol, FormInitialValues, FormSymbol } from './symbols';

interface FormOptions {
  validationSchema?: Record<string, GenericValidateFunction | string | Record<string, any>>;
  initialValues?: Record<string, any>;
  validateOnMount?: boolean;
}

type FieldComposite = ReturnType<typeof useField>;

export function useForm(opts?: FormOptions) {
  const fields: Ref<any[]> = ref([]);
  const isSubmitting = ref(false);
  const fieldsById = computed(() => {
    return fields.value.reduce((acc, field) => {
      // if the field was not added before
      if (!acc[field.name]) {
        acc[field.name] = field;
        field.idx = -1;

        return acc;
      }

      // if the same name is detected
      if (!Array.isArray(acc[field.name])) {
        const firstField = acc[field.name];
        firstField.idx = 0;
        acc[field.name] = [firstField];
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
  const formValues = reactive<Record<string, any>>({});
  const controller: FormController = {
    register(field: FieldComposite) {
      fields.value.push(field);
    },
    unregister(field: FieldComposite) {
      const idx = fields.value.indexOf(field);
      if (idx === -1) {
        return;
      }

      fields.value.splice(idx, 1);
      const fieldName = field.name;
      // in this case, this is a single field not a group (checkbox or radio)
      // so remove the field value key immediately
      if (field.idx === -1) {
        unsetPath(formValues, fieldName);
        return;
      }

      // otherwise find the actual value in the current array of values and remove it
      const valueIdx: number | undefined = getFromPath(formValues, fieldName)?.indexOf?.(unwrap(field.valueProp));

      if (valueIdx === undefined) {
        unsetPath(formValues, fieldName);

        return;
      }

      if (valueIdx === -1) {
        return;
      }

      if (Array.isArray(formValues[fieldName])) {
        unsetPath(formValues, `${fieldName}.${valueIdx}`);
        return;
      }

      unsetPath(formValues, fieldName);
    },
    fields: fieldsById,
    values: formValues,
    schema: opts?.validationSchema,
    validateSchema: isYupValidator(opts?.validationSchema)
      ? (shouldMutate = false) => {
          return validateYupSchema(controller, shouldMutate);
        }
      : undefined,
    setFieldValue(path: string, value: any) {
      const field = fieldsById.value[path];

      // singular inputs fields
      if (!field || (!Array.isArray(field) && field.type !== 'checkbox')) {
        setInPath(formValues, path, value);
        return;
      }

      // Radio buttons and other unknown group type inputs
      if (Array.isArray(field) && field[0].type !== 'checkbox') {
        setInPath(formValues, path, value);
        return;
      }

      // Single Checkbox
      if (!Array.isArray(field) && field.type === 'checkbox') {
        const newVal = getFromPath(formValues, path) === value ? undefined : value;
        setInPath(formValues, path, newVal);
        return;
      }

      // Multiple Checkboxes but their whole value was updated
      if (Array.isArray(value)) {
        setInPath(formValues, path, value);
        return;
      }

      // Multiple Checkboxes and a single item is updated
      const oldVal = getFromPath(formValues, path);
      const newVal = Array.isArray(oldVal) ? [...oldVal] : [];
      if (newVal.includes(value)) {
        const idx = newVal.indexOf(value);
        newVal.splice(idx, 1);

        setInPath(formValues, path, newVal);
        return;
      }

      newVal.push(value);
      setInPath(formValues, path, newVal);
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
      acc[field.name] = unwrap(field.errorMessage);

      return acc;
    }, {});
  });

  const handleReset = () => {
    fields.value.forEach((f: any) => f.reset());
  };

  const activeFormValues = computed(() => {
    return activeFields.value.reduce((formData: Record<string, any>, field) => {
      setInPath(formData, field.name, unwrap(field.value));

      return formData;
    }, {});
  });

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
            return fn(activeFormValues.value, e as SubmitEvent);
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

  provide(FormSymbol, controller);
  provide(FormErrorsSymbol, errors);
  provide(FormInitialValues, opts?.initialValues || {});

  onMounted(() => {
    if (opts?.validateOnMount) {
      validate();
    }
  });

  return {
    errors,
    meta,
    form: controller,
    values: formValues,
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

  return computed(() => {
    return flags.reduce((acc, flag: Flag) => {
      const mergeMethod = MERGE_STRATEGIES[flag];
      acc[flag] = fields.value[mergeMethod](field => field.meta[flag]);

      return acc;
    }, {} as Record<string, boolean>);
  });
}

async function validateYupSchema(
  form: FormController,
  shouldMutate = false
): Promise<Record<string, ValidationResult>> {
  const errors: any[] = await (form.schema as any)
    .validate(form.values, { abortEarly: false })
    .then(() => [])
    .catch((err: ValidationError) => {
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
