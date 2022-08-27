<template>
  <a
    target="_blank"
    rel="noopener"
    href="https://github.com/sponsors/logaretm"
    class="flex items-center group text-white bg-pink-600 rounded-md shadow hover:bg-pink-700 focus:ring focus:ring-pink-500 focus:outline-none"
    :class="{ 'px-3.5 py-1': !size || size === 'sm', 'px-5 py-2.5': size === 'lg' }"
  >
    <svg
      class="stroke-current transform transition duration-200 group-hover:scale-110"
      :class="{ 'w-5 h-5': !size || size === 'sm', 'w-6 h-6': size === 'lg' }"
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

    <span class="ml-1 font-display" :class="{ 'text-sm': !size || size === 'sm', 'font-medium': size === 'lg' }"
      >Sponsor</span
    >
  </a>
</template>

<script setup lang="ts">
defineProps<{
  size?: 'sm' | 'lg';
}>();
</script>
