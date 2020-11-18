<template>
  <header class="pt-3 pb-3 sticky top-0 dark:bg-gray-700 bg-white z-20 border-b dark:border-gray-600 border-gray-200">
    <div
      class="px-4 lg:px-8 py-2 lg:py-0 text-sm lg:text-base w-full text-black bg-warning fixed font-bold bottom-0 lg:top-0 lg:h-10 flex items-center"
      v-if="displayWarning"
    >
      <p class="ml-auto">
        ⛔️ HEADS UP: You are viewing the documentation for v4.x (Vue 3.0) For Vue 2.x head over to
        <a href="https://vee-validate.logaretm.com/v3" class="underline"> v3.x documentation</a>
      </p>
      <button class="ml-auto" title="close warning" @click="hideWarning">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    </div>

    <svg style="width: 0; height: 0; position: absolute" aria-hidden="true" focusable="false">
      <linearGradient id="logo-fill" x2="1" y2="1">
        <stop offset="0" stop-color="#06d77b"></stop>
        <stop offset="1" stop-color="#009f53"></stop>
      </linearGradient>
    </svg>

    <div class="flex items-center header__content px-6 lg:px-10" :class="{ 'lg:mt-8': displayWarning }">
      <nuxt-link class="mr-auto" to="/">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 858.42 693.79" class="h-10 w-10 lg:w-12 lg:h-12 logo">
          <path
            d="M572.4 0l-57.49 99.56-171.23 296.59L172.45 99.56h118.02l53.21 92.14 53.21-92.14L454.36 0H0l343.68 595.28L687.36 0H572.4z"
          ></path>
        </svg>
      </nuxt-link>

      <AlgoliaSearchBox class="w-full" />

      <SideMenuButton class="ml-auto block lg:hidden relative z-30" v-model="isMenuOpen" />
      <SideMenu v-model="isMenuOpen" />

      <VersionSwitcher />

      <a
        href="https://github.com/logaretm/vee-validate"
        target="_blank"
        rel="noopener"
        class="ml-4 transition-opacity opacity-50 dark:text-white hover:opacity-100 text-gray-700 duration-200 hidden lg:block"
      >
        <svg class="fill-current w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <title>GitHub</title>
          <path
            d="M10 0a10 10 0 0 0-3.16 19.49c.5.1.68-.22.68-.48l-.01-1.7c-2.78.6-3.37-1.34-3.37-1.34-.46-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.1.39-1.99 1.03-2.69a3.6 3.6 0 0 1 .1-2.64s.84-.27 2.75 1.02a9.58 9.58 0 0 1 5 0c1.91-1.3 2.75-1.02 2.75-1.02.55 1.37.2 2.4.1 2.64.64.7 1.03 1.6 1.03 2.69 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85l-.01 2.75c0 .26.18.58.69.48A10 10 0 0 0 10 0"
          ></path>
        </svg>
      </a>

      <ThemeSwitcher class="ml-4 hidden lg:flex" />
    </div>
  </header>
</template>

<script>
export default {
  name: 'TheHeader',
  data: () => ({
    isMenuOpen: false,
    displayWarning: false,
  }),
  mounted() {
    this.displayWarning = !localStorage.getItem('hide_version_warning');
  },
  methods: {
    hideWarning() {
      this.displayWarning = false;
      localStorage.setItem('hide_version_warning', '1');
    },
  },
};
</script>

<style lang="postcss" scoped>
.header__content {
  max-width: 1300px;
  @apply mx-auto;
}

.logo {
  fill: url(#logo-fill) #06d77b;
}
</style>
