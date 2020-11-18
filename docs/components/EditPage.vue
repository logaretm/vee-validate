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

    <a
      href="https://www.patreon.com/bePatron?u=26796482"
      target="_blank"
      class="ml-auto bg-patreon text-white px-4 py-2 rounded-full text-sm flex items-center"
    >
      <svg class="w-4 h-4 fill-current" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <title>Support Me on Patreon</title>
        <path
          d="M15.386.524c-4.764 0-8.64 3.876-8.64 8.64 0 4.75 3.876 8.613 8.64 8.613 4.75 0 8.614-3.864 8.614-8.613C24 4.4 20.136.524 15.386.524M.003 23.537h4.22V.524H.003"
        />
      </svg>

      <span class="ml-2">Support vee-validate</span>
    </a>
  </div>
</template>

<script>
export default {
  name: 'EditPage',
  computed: {
    pageLink() {
      const path = this.$route.path.replace(/\/$/g, '');

      return `https://github.com/logaretm/vee-validate/edit/main/docs/content${path}.md`;
    },
  },
};
</script>
