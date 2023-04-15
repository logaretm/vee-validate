import { defineNuxtModule, addComponent, addImports } from '@nuxt/kit';
import type { NuxtModule } from '@nuxt/schema';

const components = ['Field', 'Form', 'ErrorMessage', 'FieldArray'];

const composables = [
  'useField',
  'useForm',
  'useFieldArray',
  'useFieldError',
  'useFieldValue',
  'useFormErrors',
  'useFormValues',
  'useIsFieldDirty',
  'useIsFieldTouched',
  'useIsFieldValid',
  'useIsFormDirty',
  'useIsFormTouched',
  'useIsFormValid',
  'useIsSubmitting',
  'useResetForm',
  'useSubmitCount',
  'useSubmitForm',
  'useValidateField',
  'useValidateForm',
];

export default defineNuxtModule({
  meta: {
    name: 'vee-valiate',
    configKey: 'veeValidate',
  },
  setup(options, nuxt) {
    composables.forEach(composable => {
      addImports({
        name: composable,
        as: composable,
        from: 'vee-validate',
      });
    });

    components.forEach(component => {
      addComponent({
        name: component,
        export: component,
        filePath: 'vee-validate',
      });
    });
  },
}) as NuxtModule;
