<template>
  <header class="pt-3 pb-3 sticky top-0 dark:bg-gray-700 bg-white z-20 border-b dark:border-gray-600 border-gray-200">
    <div
      class="px-4 lg:px-8 py-2 lg:py-0 text-sm lg:text-base w-full text-black bg-warning fixed font-bold bottom-0 lg:top-0 lg:h-10 flex items-center"
      v-if="displayWarning"
    >
      <p class="ml-auto">
        ⛔️ HEADS UP: You are viewing the documentation for v4.x (Vue 3.0) For Vue 2.x head over to
        <a href="https://vee-validate.logaretm.com/v3/" class="underline"> v3.x documentation</a>
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
      <a class="mr-auto flex items-center" href="/v4/">
        <Icon name="logo" class="h-8 w-8 lg:w-10 lg:h-10 logo" />

        <span
          class="ml-2 font-display text-xl bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-500 text-transparent font-semibold"
          >VeeValidate</span
        >
      </a>

      <SideMenuButton class="ml-auto block lg:hidden relative z-30" v-model="isMenuOpen" />
      <SideMenu v-model="isMenuOpen" :menu="menu" :current-url="currentUrl" />

      <VersionSwitcher />

      <a
        href="https://github.com/logaretm/vee-validate/"
        target="_blank"
        rel="noopener"
        class="ml-4 transition-opacity opacity-50 dark:text-white hover:opacity-100 text-gray-700 duration-200 hidden lg:block"
      >
        <Icon name="github" class="fill-current w-5 h-5" />
      </a>

      <ThemeSwitcher class="ml-4 hidden lg:flex" />
    </div>
  </header>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import SideMenuButton from '@/components/SideMenuButton.vue';
import Icon from '@/components/Icon.vue';
import ThemeSwitcher from '@/components/ThemeSwitcher.vue';
import SideMenu from '@/components/SideMenu.vue';
import VersionSwitcher from '@/components/VersionSwitcher.vue';

const props = defineProps<{
  menu: { title: string; pages: any[] }[];
  currentUrl: string;
}>();

const isMenuOpen = ref(false);
const displayWarning = ref(false);

onMounted(() => {
  displayWarning.value = !localStorage.getItem('hide_version_warning');
});

function hideWarning() {
  displayWarning.value = false;
  localStorage.setItem('hide_version_warning', '1');
}
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
