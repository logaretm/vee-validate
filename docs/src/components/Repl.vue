<script setup lang="ts" async>
import '@vue/repl/style.css';
import { Repl, ReplStore } from '@vue/repl';

const props = defineProps<{
  files: Record<string, string>;
}>();

const files = await Promise.all(
  Object.entries(props.files).map(async ([filename, componentName]) => {
    const code = await import(`./examples/${componentName}.vue?raw`);

    return [filename, code.default];
  })
);

const store = new ReplStore({
  serializedState: btoa(JSON.stringify(Object.fromEntries(files))),
});

// pre-set import map
store.setImportMap({
  imports: {
    'vee-validate': 'https://unpkg.com/vee-validate@4.9.5/dist/vee-validate.esm.js',
    '@vee-validate/zod': 'https://unpkg.com/@vee-validate/zod@4.9.5/dist/vee-validate-zod.esm.js',
    '@vee-validate/yup': 'https://unpkg.com/@vee-validate/yup@4.9.5/dist/vee-validate-yup.esm.js',
    '@vee-validate/i18n': 'https://unpkg.com/@vee-validate/i18n@4.9.5/dist/vee-validate-i18n.esm.js',
    '@vee-validate/rules': 'https://unpkg.com/@vee-validate/rules@4.9.5/dist/vee-validate-rules.esm.js',
    'property-expr': 'https://esm-repo.netlify.app/property-expr.esm.js',
    'tiny-case': 'https://esm-repo.netlify.app/tiny-case.esm.js',
    toposort: 'https://esm-repo.netlify.app/topsort.esm.js',
    yup: 'https://unpkg.com/yup@1.2.0/index.esm.js',
    zod: 'https://unpkg.com/zod@3.21.4/lib/index.mjs',
    '@vue/devtools-api': 'https://unpkg.com/@vue/devtools-api@6.5.0/lib/esm/index.js',
  },
});

// use a specific version of Vue
store.setVueVersion('3.3.4');
</script>

<template>
  <Repl :store="store" :showCompileOutput="false" :ssr="false" :showImportMap="false" />
</template>

<style lang="postcss" scoped>
.vue-repl {
  @apply border-2 border-emerald-500 border-opacity-30 rounded-md;
  --bg: #e8e8e8 !important;
  --bg-soft: #e8e8e8 !important;
  --border: hsl(0 0% 74%) !important;
  --text-light: #000 !important;
  --color-branding: #009f53 !important;
  --color-branding-dark: #009f53 !important;

  &:deep(iframe) {
    margin: 0;
  }

  &:deep(.stretch) {
    @apply items-stretch;
  }

  &:deep(.right) {
    height: unset;

    .active {
      @apply border-none;
    }
  }

  &:deep(.CodeMirror) {
    background-color: #f6f6f6;
    color: var(--symbols);
    --symbols: #2c3e50;
    --base: #2c3e50;
    --comment: #848486;
    --keyword: #b2085f;
    --string: #0a7a34;
    --variable: #c25205;
    --number: #9580ff;
    --tags: #b2085f;
    --brackets: var(--symbols);
    --property: var(--symbols);
    --attribute: #c25205;
    --cursor: #fff;
    --selected-bg: #454158;
    --selected-bg-non-focus: rgba(255, 255, 255, 0.15);
  }
}

.dark {
  .vue-repl {
    --bg: hsl(240 6% 9%) !important;
    --bg-soft: hsl(240 6% 9%) !important;
    --border: #333 !important;
    --text-light: #aaa !important;
    --color-branding: #06d77b !important;
    --color-branding-dark: #06d77b !important;

    &:deep(.CodeMirror) {
      color: var(--symbols);
      background-color: #22212c;
      --symbols: #f8f8f2;
      --base: #f8f8f2;
      --comment: #7970a9;
      --keyword: #ff80bf;
      --string: #ffff80;
      --variable: #8aff80;
      --number: #9580ff;
      --tags: #ff80bf;
      --brackets: var(--symbols);
      --property: var(--symbols);
      --attribute: #8aff80;
      --cursor: #fff;
      --selected-bg: #454158;
      --selected-bg-non-focus: rgba(255, 255, 255, 0.15);
    }
  }
}
</style>
