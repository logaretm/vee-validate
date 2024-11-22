import { defineNuxtModule, addComponent, addImports, logger, resolveModule } from '@nuxt/kit';
import type { Nuxt, NuxtModule } from '@nuxt/schema';
import { isPackageExists } from 'local-pkg';

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

const schemaProviders = ['zod', 'yup', 'valibot'] as const;
const schemaProviderResolvers: Record<(typeof schemaProviders)[number], string> = {
  zod: '@vee-validate/zod',
  yup: '@vee-validate/yup',
  valibot: '@vee-validate/valibot',
};

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

    if (options.typedSchemaPackage === 'yup') {
      checkForYup(options, nuxt);
      return;
    }

    if (options.typedSchemaPackage === 'zod') {
      checkForZod(options, nuxt);
      return;
    }

    if (options.typedSchemaPackage === 'valibot') {
      checkForValibot(options, nuxt);
      return;
    }

    if (!checkForYup(options, nuxt)) {
      if (!checkForZod(options, nuxt)) {
        checkForValibot(options, nuxt);
      }
    }
  },
}) as NuxtModule<VeeValidateNuxtOptions>;

function checkSchemaResolverDependencies(pkgName: (typeof schemaProviders)[number]) {
  const makeMsg = (installed: string, uninstalled: string) =>
    `You seem to be using ${installed}, but you have not installed ${uninstalled}. Please install it to use ${pkgName} with vee-validate.`;

  const resolverPkg = schemaProviderResolvers[pkgName];
  if (isPackageExists(pkgName) && !isPackageExists(resolverPkg)) {
    logger.warn(makeMsg(pkgName, resolverPkg));
    return true;
  }

  if (isPackageExists(resolverPkg) && !isPackageExists(pkgName)) {
    logger.warn(makeMsg(resolverPkg, pkgName));
    return true;
  }
}

function checkForValibot(options: VeeValidateNuxtOptions, nuxt: Nuxt) {
  checkSchemaResolverDependencies('valibot');
  if (isPackageExists('@vee-validate/valibot') && isPackageExists('valibot')) {
    logger.info('Using valibot with vee-validate');
    if (options.autoImports) {
      addImports({
        name: 'toTypedSchema',
        as: 'toTypedSchema',
        from: '@vee-validate/valibot',
      });
    }

    addMjsAlias('@vee-validate/valibot', 'vee-validate-valibot', nuxt);

    return true;
  }

  return false;
}

function checkForZod(options: VeeValidateNuxtOptions, nuxt: Nuxt) {
  checkSchemaResolverDependencies('zod');
  if (isPackageExists('@vee-validate/zod') && isPackageExists('zod')) {
    logger.info('Using zod with vee-validate');
    if (options.autoImports) {
      addImports({
        name: 'toTypedSchema',
        as: 'toTypedSchema',
        from: '@vee-validate/zod',
      });
    }

    addMjsAlias('@vee-validate/zod', 'vee-validate-zod', nuxt);

    return true;
  }

  return false;
}

function checkForYup(options: VeeValidateNuxtOptions, nuxt: Nuxt) {
  checkSchemaResolverDependencies('yup');
  if (isPackageExists('@vee-validate/yup') && isPackageExists('yup')) {
    logger.info('Using yup with vee-validate');
    if (options.autoImports) {
      addImports({
        name: 'toTypedSchema',
        as: 'toTypedSchema',
        from: '@vee-validate/yup',
      });
    }

    addMjsAlias('@vee-validate/yup', 'vee-validate-yup', nuxt);

    return true;
  }

  return false;
}

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
