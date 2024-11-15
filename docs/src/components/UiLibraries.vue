<template>
  <div class="grid grid-flow-col justify-center content-center py-8 gap-10">
    <div v-for="lib in libraries" :key="lib.name">
      <a :href="lib.link" :title="lib.name" target="_blank" rel="noopener">
        <img :src="lib.logoLight" loading="lazy" class="dark:hidden w-24 h-24" :alt="lib.name" />
        <img :src="lib.logoDark" loading="lazy" class="hidden dark:block w-24 h-24" :alt="lib.name" />
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
const libraries = [
  {
    name: 'Shadcn Vue',
    link: 'https://www.shadcn-vue.com/docs/components/form',
    logoLight: '/img/shadcn.svg',
    logoDark: '/img/shadcn.svg',
  },
  {
    name: 'Vuetify',
    link: 'https://vuetifyjs.com/en/components/forms/#vee-validate',
    logoLight: 'https://cdn.vuetifyjs.com/docs/images/logos/vuetify-logo-v3-light.svg',
    logoDark: 'https://cdn.vuetifyjs.com/docs/images/logos/vuetify-logo-v3-light.svg',
  },
];
</script>
