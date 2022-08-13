<template>
  <div>
    <ContentWrapper :document="page.content" />

    <DocFlavor v-if="page.isOverview" next="validation" />
    <DocNextStep v-else-if="page.nextPage" v-bind="page.nextPage" />
  </div>
</template>

<script setup lang="ts">
import { generateSocialImage, generateMetaTags, generateLinks, normalizeCatchAllPath } from '@/utils/seo';

const route = useRoute();
const slug = Array.isArray(route.params.slug) ? route.params.slug.filter(Boolean).join('-') : route.params.slug;

const { data: page, error } = await useAsyncData(slug, async () => {
  const content = await queryContent(normalizeCatchAllPath(route.params.slug)).findOne();
  const nextPage = await queryContent(content.next)
    .only(['title', 'description', 'path'])
    .findOne()
    .catch(() => null);

  const isOverview = /overview/i.test(slug);

  return {
    content,
    nextPage,
    isOverview,
  };
});

const config = useRuntimeConfig();

useHead(() => {
  const url = `${config.public.appURL}${route.path}`;
  const links = generateLinks({
    url,
  });

  const image = generateSocialImage({
    title: page.value.content.title,
    tagline: page.value.content.description,
    imagePublicID: 'open-source/vee-validate-share',
  });

  const meta = generateMetaTags({
    title: page.value.content.title,
    description: page.value.content.description,
    url,
    image,
  });

  return {
    title: page.value.content.title,
    meta,
    links,
  };
});
</script>
