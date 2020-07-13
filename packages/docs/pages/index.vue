<template>
  <div>
    <div class="flex flex-col items-center justify-center mb-16">
      <img src="/logo.png" width="300" height="300" alt="" />
      <h1 class="mt-4 text-4xl font-bold font-display">{{ page.title }}</h1>
      <p class="mt-4 text-xl text-gray">{{ page.description }}</p>

      <div class="mt-16 grid grid-cols-3 col-gap-16">
        <div v-for="feature in page.features" :key="feature.title">
          <h3 class="text-xl font-bold font-display">{{ feature.title }}</h3>
          <p class="mt-2">{{ feature.details }}</p>
        </div>
      </div>
    </div>

    <ContentWrapper :document="page" />
  </div>
</template>

<script>
import { store } from '@/plugins/appstate';
import { slugify } from '@/utils/string';

export default {
  async asyncData({ $content, params }) {
    const page = await $content('home').fetch();

    return {
      page,
    };
  },
  mounted() {
    function linkify(node) {
      const anchor = document.createElement('a');
      const slug = slugify(node.textContent);
      anchor.href = `#${slug}`;
      anchor.textContent = node.textContent;
      node.id = slug;
      node.textContent = '';
      node.appendChild(anchor);
    }

    Array.from(this.$el.querySelectorAll('h2')).forEach(linkify);
    Array.from(this.$el.querySelectorAll('h3')).forEach(linkify);
    // set the current document
    store.currentDoc = this.page;
  },
};
</script>
