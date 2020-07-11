<template>
  <header class="flex items-center py-3 px-6 relative">
    <nuxt-link class="mr-auto" to="/">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 858.42 693.79" class="h-10 w-10">
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

    <SideMenuButton class="ml-auto block relative z-30" v-model="isMenuOpen" />
    <SideMenu v-model="isMenuOpen" />
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
}
</style>
