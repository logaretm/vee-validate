import { defineNuxtModule, addComponent, addImports, logger } from '@nuxt/kit';
import type { NuxtModule } from '@nuxt/schema';
import { isPackageExists } from 'local-pkg';

type ComponentName = 'Field' | 'Form' | 'ErrorMessage' | 'FieldArray';
export interface VeeValidateNuxtOptions {
  autoImports?: boolean;
  componentNames?: Partial<Record<ComponentName, string>>;
}

const components: ComponentName[] = ['Field', 'Form', 'ErrorMessage', 'FieldArray'];

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

export default defineNuxtModule<VeeValidateNuxtOptions>({
  meta: {
    name: 'vee-validate',
    configKey: 'veeValidate',
  },
  defaults: {
    autoImports: true,
    componentNames: {},
  },
  setup(options) {
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
          name: options.componentNames?.[component] ?? component,
          export: component,
          filePath: 'vee-validate',
        });
      });
    }

    const usingYup = checkForYup(options);
    if (!usingYup) {
      if (!checkForZod(options)) {
        checkForValibot(options);
      }
    }
  },
}) as NuxtModule<VeeValidateNuxtOptions>;

function checkForValibot(options: VeeValidateNuxtOptions) {
  if (isPackageExists('valibot') && !isPackageExists('@vee-validate/valibot')) {
    logger.warn(
      'You seem to be using valibot, but you have not installed @vee-validate/valibot. Please install it to use valibot with vee-validate.',
    );
    return true;
  }

  if (isPackageExists('@vee-validate/valibot') && !isPackageExists('valibot')) {
    logger.warn(
      'You seem to be using @vee-validate/valibot, but you have not installed valibot. Please install it to use valibot with vee-validate.',
    );
    return true;
  }

  if (isPackageExists('@vee-validate/valibot') && isPackageExists('valibot')) {
    logger.info('Using valibot with vee-validate');
    if (options.autoImports) {
      addImports({
        name: 'toTypedSchema',
        as: 'toTypedSchema',
        from: '@vee-validate/valibot',
      });
    }

    return true;
  }

  return false;
}

function checkForZod(options: VeeValidateNuxtOptions) {
  if (isPackageExists('zod') && !isPackageExists('@vee-validate/zod')) {
    logger.warn(
      'You seem to be using zod, but you have not installed @vee-validate/zod. Please install it to use zod with vee-validate.',
    );
    return true;
  }

  if (isPackageExists('@vee-validate/zod') && !isPackageExists('zod')) {
    logger.warn(
      'You seem to be using @vee-validate/zod, but you have not installed zod. Please install it to use zod with vee-validate.',
    );
    return true;
  }

  if (isPackageExists('@vee-validate/zod') && isPackageExists('zod')) {
    logger.info('Using zod with vee-validate');
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

function checkForYup(options: VeeValidateNuxtOptions) {
  if (isPackageExists('yup') && !isPackageExists('@vee-validate/yup')) {
    logger.warn(
      'You seem to be using yup, but you have not installed @vee-validate/yup. Please install it to use yup with vee-validate.',
    );
    return true;
  }

  if (isPackageExists('@vee-validate/yup') && !isPackageExists('yup')) {
    logger.warn(
      'You seem to be using @vee-validate/yup, but you have not installed yup. Please install it to use yup with vee-validate.',
    );
    return true;
  }

  if (isPackageExists('@vee-validate/yup') && isPackageExists('yup')) {
    logger.info('Using yup with vee-validate');
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

declare module '@nuxt/schema' {
  interface NuxtConfig {
    'vee-validate'?: VeeValidateNuxtOptions;
  }
  interface NuxtOptions {
    'vee-validate'?: VeeValidateNuxtOptions;
  }
}
