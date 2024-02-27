<template>
  <div v-if="!hasError" id="ad" :class="{ 'placement-home': placement === 'home-page' }">
    <!-- Show an image ad -->
    <div data-ea-publisher="vee-validatelogaretmcom" data-ea-type="image"></div>
  </div>

  <div v-else id="ad" class="error">
    <div class="p-4 flex flex-col">
      <span class="font-bold font-display">🙏 Enable Ads</span>
      <span class="mt-2"> Please enable ads on your browser for this website. </span>
      <span class="mt-1"> Ads are a funding source to this project. </span>

      <div class="mt-2 or-fund-it">
        <span class="mx-1 whitespace-nowrap">or consider</span>
      </div>

      <a
        target="_blank"
        rel="noopener"
        href="https://github.com/sponsors/logaretm"
        class="mt-2 bg-pink-600 py-1 px-2 text-white font-medium flex items-center justify-center font-display rounded group hover:bg-pink-700"
      >
        <svg
          class="stroke-current transform transition duration-200 group-hover:scale-110 w-5 h-5 mr-1"
          fill="none"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          ></path>
        </svg>

        Sponsor
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';

defineProps<{
  placement?: 'content' | 'home-page';
}>();

const hasError = ref(false);

function loadScript() {
  const script = document.createElement('script');
  script.src = 'https://media.ethicalads.io/media/client/ethicalads.min.js';

  const el = document.querySelector('#ad');
  el?.appendChild(script);
  script.onerror = error => {
    if (navigator.onLine) {
      hasError.value = true;
    }
  };
}

onMounted(loadScript);
</script>

<style lang="postcss">
#ad {
  @apply static text-gray-400 mt-4 hidden md:block;
  z-index: 1;

  .ea-placement {
    @apply rounded-md overflow-hidden bg-zinc-200;

    .ea-content {
      @apply m-0 rounded-none;

      a {
        @apply text-zinc-500;
      }

      strong {
        @apply text-accent-900;
      }
    }

    .ea-callout {
      @apply m-0 py-2 px-4 text-center bg-zinc-300 rounded-none;
    }
  }

  &.error {
    width: 180px;
  }
}

.dark {
  #ad {
    .ea-placement {
      @apply bg-zinc-800;
    }

    .ea-callout {
      @apply bg-zinc-950;

      a {
        @apply text-zinc-600;
      }
    }

    &.error {
      @apply bg-zinc-800;
    }
  }
}

.or-fund-it {
  @apply text-zinc-500 flex items-center space-x-2;

  &::before,
  &::after {
    height: 1px;
    width: 100%;
    content: '';
    @apply flex-shrink bg-zinc-500;
  }
}
</style>
