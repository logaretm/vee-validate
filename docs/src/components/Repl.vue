<script setup lang="ts" async>
import { ref, version } from 'vue';
import { useFullscreen } from '@vueuse/core';
import { Repl, ReplStore } from '@vue/repl';
import { getViteProjectConfig } from '@/utils/examples';
import StackBlitzSdk from '@stackblitz/sdk';

const props = defineProps<{
  files: Record<string, string>;
  editor: any;
}>();

const containerRef = ref<HTMLElement>();
const { isFullscreen, toggle: toggleFullscreen } = useFullscreen(containerRef);

const files = await Promise.all(
  Object.entries(props.files).map(async ([filename, componentName]) => {
    const code = await import(`./examples/${componentName}.vue?raw`);

    return [filename, code.default];
  }),
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
    '@vee-validate/valibot': 'https://unpkg.com/@vee-validate/valibot@latest/dist/vee-validate-valibot.esm.js',
    '@vee-validate/i18n': 'https://unpkg.com/@vee-validate/i18n@latest/dist/vee-validate-i18n.esm.js',
    '@vee-validate/rules': 'https://unpkg.com/@vee-validate/rules@latest/dist/vee-validate-rules.esm.js',
    'property-expr': 'https://esm-repo.netlify.app/property-expr.esm.js',
    'tiny-case': 'https://esm-repo.netlify.app/tiny-case.esm.js',
    toposort: 'https://esm-repo.netlify.app/topsort.esm.js',
    yup: 'https://unpkg.com/yup@1.2.0/index.esm.js',
    zod: 'https://unpkg.com/zod@3.21.4/lib/index.mjs',
    valibot: 'https://unpkg.com/valibot@0.21.0/dist/index.js',
    '@vue/devtools-api': 'https://unpkg.com/@vue/devtools-api@6.5.0/lib/esm/index.js',
    vue: `https://unpkg.com/vue@${version}/dist/vue.esm-browser.prod.js`,
  },
});

// use a specific version of Vue
store.setVueVersion(version);

function onForkClick() {
  const exampleFiles = files.reduce(
    (acc, file) => {
      acc[file[0]] = file[1];

      return acc;
    },
    {} as Record<string, string>,
  );

  StackBlitzSdk.openProject(getViteProjectConfig(exampleFiles), {
    newWindow: true,
    startScript: 'dev',
    openFile: 'src/App.vue',
  });
}
</script>

<template>
  <div
    class="flex flex-col border border-gray-300 dark:border-emerald-500 border-opacity-80 rounded-md shadow-sm overflow-hidden relative"
    ref="containerRef"
  >
    <div class="flex items-center justify-end py-1.5 px-2 absolute z-10 right-0 h-[var(--header-height)]">
      <button
        type="button"
        class="ml-1 p-1 hover:bg-white hover:bg-opacity-10 rounded"
        title="Go full screen"
        @click="toggleFullscreen"
      >
        <svg
          class="w-4 h-4 text-white"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            v-if="!isFullscreen"
            d="M13.28 7.78l3.22-3.22v2.69a.75.75 0 001.5 0v-4.5a.75.75 0 00-.75-.75h-4.5a.75.75 0 000 1.5h2.69l-3.22 3.22a.75.75 0 001.06 1.06zM2 17.25v-4.5a.75.75 0 011.5 0v2.69l3.22-3.22a.75.75 0 011.06 1.06L4.56 16.5h2.69a.75.75 0 010 1.5h-4.5a.747.747 0 01-.75-.75zM12.22 13.28l3.22 3.22h-2.69a.75.75 0 000 1.5h4.5a.747.747 0 00.75-.75v-4.5a.75.75 0 00-1.5 0v2.69l-3.22-3.22a.75.75 0 10-1.06 1.06zM3.5 4.56l3.22 3.22a.75.75 0 001.06-1.06L4.56 3.5h2.69a.75.75 0 000-1.5h-4.5a.75.75 0 00-.75.75v4.5a.75.75 0 001.5 0V4.56z"
          ></path>
          <path
            v-else
            d="M3.28 2.22a.75.75 0 00-1.06 1.06L5.44 6.5H2.75a.75.75 0 000 1.5h4.5A.75.75 0 008 7.25v-4.5a.75.75 0 00-1.5 0v2.69L3.28 2.22zM13.5 2.75a.75.75 0 00-1.5 0v4.5c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-2.69l3.22-3.22a.75.75 0 00-1.06-1.06L13.5 5.44V2.75zM3.28 17.78l3.22-3.22v2.69a.75.75 0 001.5 0v-4.5a.75.75 0 00-.75-.75h-4.5a.75.75 0 000 1.5h2.69l-3.22 3.22a.75.75 0 101.06 1.06zM13.5 14.56l3.22 3.22a.75.75 0 101.06-1.06l-3.22-3.22h2.69a.75.75 0 000-1.5h-4.5a.75.75 0 00-.75.75v4.5a.75.75 0 001.5 0v-2.69z"
          ></path>
        </svg>
      </button>

      <button
        type="button"
        class="ml-1 p-1 hover:bg-white hover:bg-opacity-10 rounded"
        title="Fork in StackBlitz"
        @click="onForkClick"
      >
        <svg
          class="w-4 h-4 text-white"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M11.983 1.907a.75.75 0 00-1.292-.657l-8.5 9.5A.75.75 0 002.75 12h6.572l-1.305 6.093a.75.75 0 001.292.657l8.5-9.5A.75.75 0 0017.25 8h-6.572l1.305-6.093z"
          ></path>
        </svg>
      </button>
    </div>
    <Repl
      :store="store"
      :editor="editor"
      :show-ts-config="false"
      :showCompileOutput="false"
      :ssr="false"
      :showImportMap="false"
      :class="{ 'no-files': files.length <= 1, 'is-fullscreen': isFullscreen }"
    />
  </div>
</template>

<style lang="postcss" scoped>
.vue-repl {
  @apply flex-grow;
  --bg: #e8e8e8 !important;
  --bg-soft: #e8e8e8 !important;
  --border: hsl(0 0% 74%) !important;
  --text-light: #000 !important;
  --color-branding: #009f53 !important;
  --color-branding-dark: #009f53 !important;

  &:deep(iframe) {
    margin: 0;
  }

  &:deep(.wrapper) {
    &:has(.toggle) {
      @apply hidden;
    }
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
    @apply invisible;
  }

  &:deep(.output-container) {
    @apply h-full;
  }

  &:deep(.editor-container) {
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

  &.is-fullscreen {
    &:deep(.CodeMirror-scroll) {
      max-height: unset;
    }
  }
}

.dark {
  .vue-repl {
    --bg: #1c1c21 !important;
    --bg-soft: hsl(240 6% 9%) !important;
    --border: #333 !important;
    --text-light: #aaa !important;
    --color-branding: #06d77b !important;
    --color-branding-dark: #06d77b !important;

    &:deep(.CodeMirror) {
      color: var(--symbols);
      background-color: #1c1c21;
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
