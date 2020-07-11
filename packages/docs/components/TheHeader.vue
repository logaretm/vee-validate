<template>
  <header class="flex items-center pt-6 pb-3 px-6 lg:px-0 relative">
    <nuxt-link class="mr-auto" to="/">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 858.42 693.79" class="h-10 w-10 lg:w-12 lg:h-12">
        <defs>
          <lineargradient id="a" x1="167.61" y1="-129.6" x2="575.97" y2="371.87" gradientUnits="userSpaceOnUse">
            <stop offset="0" stop-color="#06d77b"></stop>
            <stop offset="1" stop-color="#009f53"></stop>
          </lineargradient>
        </defs>
        <g>
          <path
            fill="url(#a)"
            d="M572.4 0l-57.49 99.56-171.23 296.59L172.45 99.56h118.02l53.21 92.14 53.21-92.14L454.36 0H0l343.68 595.28L687.36 0H572.4z"
          ></path>
        </g>
      </svg>
    </nuxt-link>

    <AlgoliaSearchBox class="w-full" />

    <SideMenuButton class="ml-auto block lg:hidden relative z-30" v-model="isMenuOpen" />
    <SideMenu v-model="isMenuOpen" />

    <a
      href="https://github.com/logaretm/vee-validate"
      target="_blank"
      rel="noopener"
      class="transition-colors text-gray hover:text-white duration-200 hidden lg:block"
    >
      <svg class="fill-current w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
        <title>GitHub</title>
        <path
          d="M10 0a10 10 0 0 0-3.16 19.49c.5.1.68-.22.68-.48l-.01-1.7c-2.78.6-3.37-1.34-3.37-1.34-.46-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.1.39-1.99 1.03-2.69a3.6 3.6 0 0 1 .1-2.64s.84-.27 2.75 1.02a9.58 9.58 0 0 1 5 0c1.91-1.3 2.75-1.02 2.75-1.02.55 1.37.2 2.4.1 2.64.64.7 1.03 1.6 1.03 2.69 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85l-.01 2.75c0 .26.18.58.69.48A10 10 0 0 0 10 0"
        ></path>
      </svg>
    </a>
  </header>
</template>

<script>
export default {
  name: 'TheHeader',
  data: () => ({
    isMenuOpen: false,
  }),
};
</script>

<style lang="postcss" scoped>
header {
  grid-area: header;

  @screen lg {
    @apply mx-auto;
    width: calc(50rem);
  }
}
</style>
