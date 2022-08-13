<template>
  <div
    class="bg-gray-800 w-full h-full flex items-center justify-center flex-col"
  >
    <!-- <template v-if="$nuxt.isOffline">
      <h1 v-if="$nuxt.isOffline" class="flex items-center">
        <svg
          class="w-12 h-12"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414"
          ></path>
        </svg>
        <span class="ml-2">Offline</span>
      </h1>

      <p
        class="mt-4 text-xl text-gray light-mode:text-dark-light light-mode:text-dark-light"
      >
        Looks like you've gone offline, and this page cannot be viewed at the
        moment.
      </p>

      <p
        v-if="pages.length"
        class="mt-8 text-xl text-gray light-mode:text-dark-light light-mode:text-dark-light"
      >
        That's okay, here is a few links that will work:
      </p>

      <p
        v-else
        class="mt-8 text-xl text-gray light-mode:text-dark-light light-mode:text-dark-light"
      >
        I got nothing to show you here, hopefully you will reconnect soon.
      </p>

      <ul class="mt-10">
        <li v-for="(link, idx) in pages" :key="idx" class="text-xl">
          <router-link :to="link.href">{{ link.title }}</router-link>
        </li>
      </ul>
    </template> -->

    <template v-if="error.name === 'NotFound'">
      <h1 class="text-6xl">404</h1>
      <p class="text-white">
        I seriously had no time nor cool ideas for this page
        <nuxt-link class="text-accent underline" to="/">
          Back to main page
        </nuxt-link>
      </p>
    </template>

    <template v-else>
      <h1 class="text-6xl dark:text-white">Umm...</h1>
      <p class="text-white">
        Something I wasn't expecting happened, maybe let me know?
        <nuxt-link class="text-accent underline" to="/">
          Back to main page
        </nuxt-link>
      </p>
    </template>
  </div>
</template>

<script setup lang="ts">
interface ErrorObject {
  message: string;
  name: string;
}

defineProps<{
  error: ErrorObject;
}>();
</script>
