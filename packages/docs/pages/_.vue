<template>
  <ContentWrapper :document="page" />
</template>

<script>
import { store } from '@/plugins/appstate';
import { slugify } from '@/utils/string';

export default {
  async asyncData({ $content, params }) {
    const page = await $content(params.pathMatch || 'home').fetch();

    return {
      page,
    };
  },
  mounted() {
    const linkify = node => {
      const anchor = document.createElement('a');
      const slug = slugify(node.textContent);
      anchor.href = `${this.$route.path}#${slug}`;
      anchor.textContent = node.textContent;
      node.id = slug;
      node.textContent = '';
      node.appendChild(anchor);
    };

    Array.from(this.$el.querySelectorAll('h2')).forEach(linkify);
    Array.from(this.$el.querySelectorAll('h3')).forEach(linkify);
    // set the current document
    store.currentDoc = this.page;
  },
};
</script>
