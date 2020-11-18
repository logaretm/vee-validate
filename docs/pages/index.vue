<template>
  <div>
    <div class="flex flex-col items-center justify-center mb-16">
      <img src="@/assets/img/logo.png" width="300" height="300" alt="" />
      <h1 class="mt-4 text-4xl font-bold font-display">{{ page.title }}</h1>
      <p class="mt-4 text-xl text-gray-400">{{ page.description }}</p>

      <div class="mt-16 grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-8">
        <div v-for="feature in page.features" :key="feature.title">
          <h4 class="md:text-xl font-bold font-display">{{ feature.title }}</h4>
          <p class="mt-2">{{ feature.details }}</p>
        </div>
      </div>

      <div class="mt-16 grid grid-cols-3 gap-x-4">
        <nuxt-link
          class="block mt-8 bg-gray-600 p-4 text-white rounded-lg font-bold text-center focus:outline-none focus:ring focus:ring-opacity-50 focus:ring-accent-800"
          to="/guide/overview"
          >📚 Getting Started</nuxt-link
        >
        <nuxt-link
          class="block mt-8 bg-warning p-4 text-gray-800 rounded-lg font-bold text-center focus:outline-none focus:ring focus:ring-opacity-50 focus:ring-accent-800"
          to="/tutorials/basics"
          >⏰ 10 Minute Tutorial</nuxt-link
        >
        <nuxt-link
          class="block mt-8 bg-error p-4 text-white rounded-lg font-bold text-center focus:outline-none focus:ring focus:ring-opacity-50 focus:ring-accent-800"
          to="/examples/checkboxes-and-radio"
          >🧪 Examples</nuxt-link
        >
      </div>
    </div>

    <ContentWrapper :document="page" />
  </div>
</template>

<script>
import { slugify } from '@/utils/string';

export default {
  layout: 'home',
  async asyncData({ $content, params, store }) {
    const page = await $content('home').fetch();
    store.commit('SET_DOC', page);

    return {
      page,
    };
  },
  mounted() {
    const linkify = node => {
      const anchor = document.createElement('a');
      const slug = slugify(node.textContent);
      anchor.href = `${this.$config.appURL}${this.$route.path}#${slug}`;
      anchor.textContent = node.textContent;
      node.id = slug;
      node.textContent = '';
      node.appendChild(anchor);
    };

    Array.from(this.$el.querySelectorAll('h2')).forEach(linkify);
    Array.from(this.$el.querySelectorAll('h3')).forEach(linkify);
  },
  head() {
    return {
      title: 'VeeValidate',
      titleTemplate: '%s',
    };
  },
};
</script>
