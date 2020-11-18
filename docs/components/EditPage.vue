<template>
  <div class="pt-4 border-t dark:border-gray-600 border-gray-200 w-full flex items-center">
    <a
      :href="pageLink"
      target="_blank"
      rel="noopener"
      class="flex items-center text-sm font-bold text-gray-600 dark:text-gray-400"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
        ></path>
      </svg>
      <span class="ml-2">Edit This Page on GitHub</span>
    </a>
  </div>
</template>

<script>
export default {
  name: 'EditPage',
  computed: {
    pageLink() {
      const path = this.$route.path.replace(/\/$/g, '');

      return `https://github.com/logaretm/vee-validate/edit/next/docs/content${path}.md`;
    },
  },
};
</script>
