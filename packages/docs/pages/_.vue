<template>
  <ContentWrapper :document="page" />
</template>

<script>
import { slugify } from '@/utils/string';
import { generateSocialImage, generateMetaTags, generateLinks } from '@/utils/seo';

export default {
  async asyncData({ $content, params, store }) {
    const page = await $content(params.pathMatch || 'home').fetch();
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
    Array.from(this.$el.querySelectorAll('h4')).forEach(linkify);
  },
  head() {
    const url = `${this.$config.appURL}${this.$route.path}`;
    const links = generateLinks({
      url,
    });

    const image = generateSocialImage({
      title: this.page.title,
      tagline: this.page.description,
      imagePublicID: 'open-source/vee-validate-share',
    });

    const meta = generateMetaTags({
      title: this.page.title,
      description: this.page.description,
      url,
      image,
    });

    return {
      title: this.page.title,
      meta,
      links,
    };
  },
};
</script>
