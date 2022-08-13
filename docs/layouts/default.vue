<template>
  <div class="AppWrapper">
    <TheHeader />
    <div class="App">
      <main class="main">
        <Ad />
        <slot />

        <div class="mt-20 pt-2 border-t dark:border-gray-600 border-gray-200 flex items-center">
          <EditPage class="" />

          <SponsorButton />
        </div>
      </main>

      <div class="lside hidden lg:block">
        <DocMenu class="sticky top-0" />
      </div>

      <div class="rside hidden xl:block">
        <DocToc :toc="[]" class="sticky top-0" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { generateLinks } from '~/utils/seo';

const config = useRuntimeConfig();
const route = useRoute();

const url = `${config.public.appURL}${route.path}`;

const theme = useAppTheme();

useHead(() => ({
  bodyAttrs: {
    class: theme.value,
  },
  link: generateLinks({
    url,
  }),
}));
</script>

<style lang="postcss" scoped>
.AppWrapper {
  @apply bg-white text-gray-700 w-full h-full min-h-screen;
}

.dark {
  .AppWrapper {
    @apply bg-gray-700 text-white;
  }
}

.App {
  @apply h-full mx-auto;
  max-width: 1500px;
  grid-template-areas:
    'content'
    'footer';
  display: grid;
  grid-gap: 20px;

  @screen lg {
    grid-template-areas:
      'lside content rside'
      'footer footer footer';
    grid-template-columns: 1.5fr 45rem 0.5fr;
    column-gap: 70px;
  }

  @screen xl {
    grid-template-areas:
      'lside content rside'
      'footer footer footer';
    grid-template-columns: 1fr 45rem 1fr;
  }
}

.lside {
  grid-area: lside;
}

.main {
  @apply py-12 px-6 min-w-0 lg:px-0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.8s ease-in-out, transform 0.2s ease-in-out;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
  transform: translate3d(40%, 0, 0);
}
</style>
