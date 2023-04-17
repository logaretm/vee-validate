import { defineNuxtModule, addComponent, addImports } from '@nuxt/kit';
import type { NuxtModule } from '@nuxt/schema';
import { isPackageExists } from 'local-pkg';

interface VeeValidateModuleOptions {
  autoImports?: boolean;
}

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

export default defineNuxtModule<VeeValidateModuleOptions>({
  meta: {
    name: 'vee-valiate',
    configKey: 'veeValidate',
  },
  defaults: {
    autoImports: true,
  },
  setup(options, nuxt) {
    if (options.autoImports) {
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
    }

    const usingYup = checkForYup(options);
    if (!usingYup) {
      checkForZod(options);
    }
  },
}) as NuxtModule<VeeValidateModuleOptions>;

function checkForZod(options: VeeValidateModuleOptions) {
  if (isPackageExists('zod') && !isPackageExists('@vee-validate/zod')) {
    console.log(
      'You seem to be using zod, but you have not installed @vee-validate/zod. Please install it to use zod with vee-validate.'
    );
    return true;
  }

  if (isPackageExists('@vee-validate/zod') && !isPackageExists('zod')) {
    console.log(
      'You seem to be using @vee-validate/zod, but you have not installed zod. Please install it to use zod with vee-validate.'
    );
    return true;
  }

  if (isPackageExists('@vee-validate/zod') && isPackageExists('zod')) {
    if (options.autoImports) {
      addImports({
        name: 'toTypedSchema',
        as: 'toTypedSchema',
        from: '@vee-validate/zod',
      });
    }

    return true;
  }

  return false;
}

function checkForYup(options: VeeValidateModuleOptions) {
  if (isPackageExists('yup') && !isPackageExists('@vee-validate/yup')) {
    console.log(
      'You seem to be using yup, but you have not installed @vee-validate/yup. Please install it to use yup with vee-validate.'
    );
    return true;
  }

  if (isPackageExists('@vee-validate/yup') && !isPackageExists('yup')) {
    console.log(
      'You seem to be using @vee-validate/yup, but you have not installed yup. Please install it to use yup with vee-validate.'
    );
    return true;
  }

  if (isPackageExists('@vee-validate/yup') && isPackageExists('yup')) {
    if (options.autoImports) {
      addImports({
        name: 'toTypedSchema',
        as: 'toTypedSchema',
        from: '@vee-validate/yup',
      });
    }

    return true;
  }

  return false;
}
