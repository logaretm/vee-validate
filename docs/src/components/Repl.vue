<script setup lang="ts" async>
import { version } from 'vue';
import { Repl, ReplStore } from '@vue/repl';
// @ts-ignore
import CodeMirror from '@vue/repl/codemirror-editor';
import '@vue/repl/style.css';

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
    'vee-validate': 'https://unpkg.com/vee-validate@latest/dist/vee-validate.esm.js',
    '@vee-validate/zod': 'https://unpkg.com/@vee-validate/zod@latest/dist/vee-validate-zod.esm.js',
    '@vee-validate/yup': 'https://unpkg.com/@vee-validate/yup@latest/dist/vee-validate-yup.esm.js',
    '@vee-validate/i18n': 'https://unpkg.com/@vee-validate/i18n@latest/dist/vee-validate-i18n.esm.js',
    '@vee-validate/rules': 'https://unpkg.com/@vee-validate/rules@latest/dist/vee-validate-rules.esm.js',
    'property-expr': 'https://esm-repo.netlify.app/property-expr.esm.js',
    'tiny-case': 'https://esm-repo.netlify.app/tiny-case.esm.js',
    toposort: 'https://esm-repo.netlify.app/topsort.esm.js',
    yup: 'https://unpkg.com/yup@1.2.0/index.esm.js',
    zod: 'https://unpkg.com/zod@3.21.4/lib/index.mjs',
    '@vue/devtools-api': 'https://unpkg.com/@vue/devtools-api@6.5.0/lib/esm/index.js',
    vue: `https://unpkg.com/vue@${version}/dist/vue.esm-browser.prod.js`,
  },
});

// use a specific version of Vue
store.setVueVersion(version);
</script>

<template>
  <Repl
    :store="store"
    :editor="CodeMirror"
    :showCompileOutput="false"
    :ssr="false"
    :showImportMap="false"
    :class="{ 'no-files': files.length <= 1 }"
  />
</template>

<style lang="postcss" scoped>
.vue-repl {
  @apply border border-gray-300 dark:border-emerald-500 border-opacity-80 rounded-md shadow-sm;
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

  &:deep(.add) {
    @apply hidden;
  }

  &:deep(.right .tab-buttons) {
    @apply hidden;
  }

  &:deep(.output-container) {
    @apply h-full;
  }

  &.no-files {
    &:deep(.file-selector) {
      @apply hidden;
    }
  }

  &:deep(.file .remove) {
    @apply hidden;
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

  &:deep(.CodeMirror-scroll) {
    max-height: 500px;
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
