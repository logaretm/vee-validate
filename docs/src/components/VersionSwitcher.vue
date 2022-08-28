<template>
  <FloatingMenu>
    <template #trigger="{ toggle, isOpen }">
      <button
        type="button"
        @click="toggle"
        class="group hidden lg:flex items-center text-sm font-semibold text-gray-400 hover:text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 px-2 py-1 rounded-md font-display"
        :class="{ 'bg-gray-200 text-gray-500 dark:bg-gray-600 dark:text-gray-400': isOpen }"
      >
        {{ versions[0].text }}
        <svg class="ml-2 fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"></path>
        </svg>
      </button>
    </template>

    <template #menu>
      <ul class="text-sm space-y-1">
        <li
          v-for="(version, idx) in versions"
          :key="idx"
          @click="onChange(version)"
          class="hover:bg-gray-200 hover:dark:bg-gray-500 hover:dark:text-white cursor-pointer select-none px-2 py-1 rounded-md text-gray-600 dark:text-gray-200 font-semibold font-display"
        >
          <div class="flex items-center">
            <span class="text-sm"> {{ version.text }}</span>
            <span class="ml-3 text-xs text-gray-400">Vue {{ version.vueVersion }}</span>
          </div>
        </li>
      </ul>
    </template>
  </FloatingMenu>
</template>

<script setup lang="ts">
import FloatingMenu from '@/components/FloatingMenu.vue';

const versions = [
  {
    text: 'v4.x',
    vueVersion: '3.x',
    link: 'https://vee-validate.logaretm.com/v4/',
  },
  {
    text: 'v3.x',
    vueVersion: '2.x',
    link: 'https://vee-validate.logaretm.com/v3/',
  },
  {
    text: 'v2.x',
    vueVersion: '2.x',
    link: 'https://vee-validate.logaretm.com/v2/',
  },
];

function onChange(version: typeof versions[0]) {
  window.location.href = version.link;
}
</script>
