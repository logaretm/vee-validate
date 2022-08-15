<template>
  <div>
    <button
      type="button"
      class="border border-gray-200 hover:border-gray-300 dark:border-carbon dark:bg-gray-600 dark:hover:border-accent-800 dark:hover:border-opacity-50 flex items-center px-4 py-2 rounded-md w-full"
      @click="onClick"
    >
      <svg
        width="24"
        height="24"
        fill="none"
        aria-hidden="true"
        class="mr-3 flex-none text-gray-300 dark:text-gray-400"
      >
        <path
          d="m19 19-3.5-3.5"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        ></path>
        <circle
          cx="11"
          cy="11"
          r="6"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        ></circle>
      </svg>

      <span class="text-sm text-gray-400 dark:text-gray-300"> Search Docs...</span>

      <span class="ml-auto flex items-center text-xs text-gray-500 dark:text-gray-300 space-x-1">
        <kbd class="bg-gray-200 dark:bg-gray-500 p-1 shadow flex-shrink-0 w-4 h-4 flex items-center justify-center"
          >⌘</kbd
        >
        <kbd class="bg-gray-200 dark:bg-gray-500 p-1 shadow flex-shrink-0 w-4 h-4 flex items-center justify-center"
          >K</kbd
        >
      </span>
    </button>

    <div id="docsearch" class="hidden"></div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';
import config from '@/config';
import docsearch from '@docsearch/js';

function stripTrailingSlash(url: string) {
  return url.replace(/\/$|\/(?=\?)|\/(?=#)/g, '');
}

function getRelativePath(absoluteUrl: string) {
  const { pathname, hash } = new URL(absoluteUrl);
  const url = pathname + hash;

  return stripTrailingSlash(url);
}

function initialize(userOptions) {
  docsearch({
    ...userOptions,
    container: '#docsearch',
    debug: process.env.NODE_ENV !== 'production',
    transformItems: items => {
      return items.map(item => {
        return {
          ...item,
          url: getRelativePath(item.url),
        };
      });
    },
  });
}

onMounted(() => {
  initialize(config.algolia);
});

function onClick() {
  (document.querySelector('#docsearch button') as HTMLElement)?.click();
}
</script>

<style lang="postcss">
@import '@docsearch/css';

.DocSearch {
  font-family: Arial, Helvetica, sans-serif;
  --docsearch-primary-color: var(--accent);
  --docsearch-highlight-color: var(--docsearch-primary-color);
  --docsearch-text-color: var(--color-gray-200);
  --docsearch-modal-background: #f6f6f6;
  --docsearch-searchbox-shadow: inset 0 0 0 2px var(--docsearch-primary-color);
  --docsearch-searchbox-background: #e8e8e8;
  --docsearch-searchbox-focus-background: #e8e8e8;
  --docsearch-hit-color: var(--color-gray-200);
  --docsearch-muted-color: var(--color-gray-500);
  --docsearch-logo-color: var(--accent);
}

.DocSearch-Button {
  @apply w-full ml-0 rounded-md px-3 !important;
}

.DocSearch-Button-Placeholder {
  @apply px-3 !important;
}

.DocSearch-Screen-Icon > svg {
  display: inline !important;
}

.dark {
  .DocSearch {
    --docsearch-text-color: #fff;
    --docsearch-container-background: rgba(9, 10, 17, 0.8);
    --docsearch-modal-background: hsl(240 6% 9%);
    --docsearch-modal-shadow: inset 1px 1px 0 0 #2c2e40, 0 3px 8px 0 #000309;
    --docsearch-searchbox-background: hsl(0 0% 29%);
    --docsearch-searchbox-focus-background: hsl(0 0% 29%);
    --docsearch-hit-color: #fff;
    --docsearch-hit-shadow: none;
    --docsearch-hit-background: #333;
    --docsearch-key-gradient: linear-gradient(-26.5deg, #161618, #4a4a4a);
    --docsearch-key-shadow: inset 0 -2px 0 0 #5a6069, inset 0 0 1px 1px #959595, 0 2px 2px 0 rgba(3, 4, 9, 0.3);
    --docsearch-footer-background: hsl(240 6% 9%);
    --docsearch-footer-shadow: inset 0 1px 0 0 rgba(73, 76, 106, 0.5), 0 -4px 8px 0 rgba(0, 0, 0, 0.2);
    --docsearch-logo-color: var(--accent);
    --docsearch-muted-color: var(--color-gray-500);
  }

  .DocSearch-NoResults,
  .DocSearch-Footer,
  .DocSearch-Help,
  .DocSearch-Reset {
    color: #e8e8e8;
  }
}
</style>
