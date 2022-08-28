<template>
  <div class="mt-8">
    <h2 class="text-2xl font-display inline-block">Choose a flavor</h2>
    <p class="mt-4">Before you go on, you should choose which flavor of vee-validate you want to use.</p>

    <div class="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-8 text-white">
      <a :href="`/v4/guide/components/${next}/`" class="bg-gray-600 hover:bg-accent-900 p-6 rounded-lg relative">
        <p class="text-xl font-semibold font-display">Components</p>
        <p class="mt-8">Simple, high-level, dynamic template-based higher-order components.</p>
        <p class="mt-4">Great for simple UI components and native HTML elements with custom styling.</p>

        <svg
          class="w-20 h-20 absolute top-0 right-0 mt-4 mr-4 text-gray-900 opacity-10"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
          ></path>
        </svg>
      </a>

      <a :href="`/v4/guide/composition-api/${next}/`" class="bg-gray-600 hover:bg-accent-900 p-6 rounded-lg relative">
        <p class="text-xl font-semibold font-display">Composition API</p>
        <p class="mt-8">Low level, intuitive composition API functions.</p>
        <p class="mt-4">Great for building complex UI form components and general purpose data validation.</p>
        <svg
          class="w-20 h-20 absolute top-0 right-0 mt-4 mr-4 text-gray-900 opacity-10"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M17 14v6m-3-3h6M6 10h2a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2zm10 0h2a2 2 0 002-2V6a2 2 0 00-2-2h-2a2 2 0 00-2 2v2a2 2 0 002 2zM6 20h2a2 2 0 002-2v-2a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2z"
          ></path>
        </svg>
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  next: String,
});
</script>

<style lang="postcss" scoped>
p {
  @apply text-lg lg:text-base;
}

h2 {
  @apply font-semibold relative text-3xl lg:text-xl;

  transform: translateX(2ch);
  &::before {
    @apply absolute text-accent-800;
    margin-left: -2ch;
    content: '#';
  }

  @screen lg {
    transform: none;
  }
}

a {
  transition: background-color 0.4s ease-in-out;

  svg {
    transition: transform 0.5s ease-in-out;
  }

  &:hover {
    svg {
      transform: scale(1.1) translate3d(-2px, 2px, 0);
    }
  }
}
</style>
