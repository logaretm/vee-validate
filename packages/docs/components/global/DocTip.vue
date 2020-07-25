<template>
  <div
    class="p-6 rounded my-8 border-l-4 dark-mode:bg-black bg-gray-100"
    :class="{
      'border-accent-800 text-accent-800': type === 'tip',
      'border-warning text-warning': type === 'warn',
      'border-error text-error': type === 'danger',
    }"
  >
    <div class="flex flex-row items-center">
      <svg v-if="['danger', 'warn'].includes(type)" fill="currentColor" class="h-6 w-6 mr-2" viewBox="0 0 20 20">
        <path
          fill-rule="evenodd"
          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
          clip-rule="evenodd"
        ></path>
      </svg>

      <svg v-if="type === 'tip'" class="h-6 w-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
        <path
          d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z"
        ></path>
      </svg>

      <p v-if="title" class="font-bold text-lg">{{ title }}</p>
      <p v-else class="font-bold text-lg uppercase">{{ type }}</p>
    </div>

    <div class="mt-4 text-black dark-mode:text-white">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: 'DocTip',
  props: {
    title: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: 'tip',
    },
  },
};
</script>

<style lang="postcss" scoped></style>
