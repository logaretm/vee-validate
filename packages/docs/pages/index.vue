<template>
  <div>
    <div class="flex flex-col items-center justify-center mb-16">
      <img src="@/assets/img/logo.png" width="300" height="300" alt="" />
      <h1 class="mt-4 text-4xl font-bold font-display">{{ page.title }}</h1>
      <p class="mt-4 text-xl text-gray-800">{{ page.description }}</p>

      <div class="mt-16 grid grid-cols-3 col-gap-8">
        <div v-for="feature in page.features" :key="feature.title">
          <h3 class="text-xl font-bold font-display">{{ feature.title }}</h3>
          <p class="mt-2">{{ feature.details }}</p>
        </div>
      </div>

      <div class="mt-16 grid grid-cols-3 col-gap-4">
        <nuxt-link class="block mt-8 bg-accent-900 p-4 text-white rounded-lg font-bold text-center" to="/guide/overview"
          >📚 Getting Started</nuxt-link
        >
        <nuxt-link
          class="block mt-8 bg-accent-900 p-4 text-white rounded-lg font-bold text-center"
          to="/tutorials/basics"
          >⏰ 10 Minute Tutorial</nuxt-link
        >
        <nuxt-link
          class="block mt-8 bg-accent-900 p-4 text-white rounded-lg font-bold text-center"
          to="/examples/checkboxes-and-radio"
          >🧪 Examples</nuxt-link
        >
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
  head() {
    return {
      title: 'VeeValidate',
      titleTemplate: '%s',
    };
  },
};
</script>
