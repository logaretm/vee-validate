<template>
  <div>
    <ContentWrapper :document="page" />

    <DocFlavor v-if="isOverview" next="validation" />
    <DocNextStep v-else-if="nextPage" v-bind="nextPage" />
  </div>
</template>

<script>
import { generateSocialImage, generateMetaTags, generateLinks } from '@/utils/seo';

export default {
  async asyncData({ $content, params, store }) {
    const page = await $content(params.pathMatch || 'home').fetch();
    store.commit('SET_DOC', page);
    const nextPage = page.next
      ? await $content(page.next)
          .only(['title', 'description', 'path'])
          .fetch()
          .catch(() => {
            return undefined;
          })
      : undefined;

    return {
      page,
      nextPage,
      isOverview: /overview/i.test(params.pathMatch),
    };
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
