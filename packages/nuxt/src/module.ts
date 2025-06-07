import { defineNuxtModule, addComponent, addImports, resolveModule } from '@nuxt/kit';
import type { Nuxt, NuxtModule } from '@nuxt/schema';

type ComponentName = 'Field' | 'Form' | 'ErrorMessage' | 'FieldArray';
type TypedSchemaPackage = 'yup' | 'zod' | 'valibot' | 'none';

export interface VeeValidateNuxtOptions {
  autoImports?: boolean;
  componentNames?: Partial<Record<ComponentName, string>>;
  typedSchemaPackage?: TypedSchemaPackage;
}

const components: ComponentName[] = ['ErrorMessage', 'Field', 'FieldArray', 'Form'];

const composables = [
  'useField',
  'useFieldArray',
  'useFieldError',
  'useFieldValue',
  'useForm',
  'useFormContext',
  'useFormErrors',
  'useFormValues',
  'useIsFieldDirty',
  'useIsFieldTouched',
  'useIsFieldValid',
  'useIsFormDirty',
  'useIsFormTouched',
  'useIsFormValid',
  'useIsSubmitting',
  'useIsValidating',
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
  setup(options, nuxt) {
    addMjsAlias('vee-validate', 'vee-validate', nuxt);
    prepareVeeValidate(nuxt);

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

    if (options.typedSchemaPackage === 'none') {
      return;
    }
  },
}) as NuxtModule<VeeValidateNuxtOptions>;

function addMjsAlias(pkgName: string, fileName: string, nuxt: Nuxt) {
  // FIXME: Deprecated, idk why since it duplicate imports
  nuxt.options.alias[pkgName] =
    nuxt.options.alias[pkgName] ||
    resolveModule(`${pkgName}/dist/${fileName}.mjs`, {
      paths: [nuxt.options.rootDir, import.meta.url],
    });
}

declare module '@nuxt/schema' {
  interface NuxtConfig {
    'vee-validate'?: VeeValidateNuxtOptions;
  }
  interface NuxtOptions {
    'vee-validate'?: VeeValidateNuxtOptions;
  }
}

/**
 * Excludes vee-validate and vee-validate/rules from the optimization process.
 * The optimization process causes issues with the symbols export not matching between the module components and the main vee-validate package.
 * Maybe it is because vite chunks them in different files/sources.
 * Only happens with SSR tho, SPA works.
 */
function prepareVeeValidate(nuxt: Nuxt) {
  nuxt.options.vite.optimizeDeps = nuxt.options.vite.optimizeDeps || {};
  nuxt.options.vite.optimizeDeps.exclude = nuxt.options.vite.optimizeDeps.exclude || [];
  nuxt.options.vite.optimizeDeps.exclude.push('vee-validate', '@vee-validate/rules');
}
