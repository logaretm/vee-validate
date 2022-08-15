<template>
  <button class="opacity-50 transition-opacity duration-200 hover:opacity-100" @click="isDark = !isDark">
    <transition name="popup" mode="out-in">
      <svg
        v-if="isDark"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        version="1.1"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        class="fill-current text-white"
      >
        <title>Dark Mode</title>
        <path d="M0 0h24v24H0z" fill="none" />
        <path
          d="M11,12A8,8,0,0,0,5.67,4.46a1,1,0,0,1,0-1.88A9.66,9.66,0,0,1,9,2,10,10,0,0,1,9,22a9.66,9.66,0,0,1-3.34-.58,1,1,0,0,1,0-1.88A8,8,0,0,0,11,12Z"
        />
      </svg>
      <svg
        v-else
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        version="1.1"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        class="fill-current text-dark"
      >
        <title>Light Mode</title>
        <path d="M0 0h24v24H0z" fill="none" />
        <path
          d="M12,19a1,1,0,0,1,1,1v1a1,1,0,0,1-2,0V20A1,1,0,0,1,12,19ZM13,4V3a1,1,0,0,0-2,0V4a1,1,0,0,0,2,0ZM3,11a1,1,0,0,0,0,2H4a1,1,0,0,0,0-2Zm18,0H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2ZM4.93,17.65a1,1,0,0,0,0,1.42,1,1,0,0,0,1.42,0l.7-.7A1,1,0,0,0,5.63,17ZM19.07,4.93a1,1,0,0,0-1.42,0l-.7.7a1,1,0,0,0,0,1.42,1,1,0,0,0,1.42,0l.7-.7A1,1,0,0,0,19.07,4.93Zm-14.14,0a1,1,0,0,0,0,1.42l.7.7a1,1,0,0,0,1.42,0,1,1,0,0,0,0-1.42l-.7-.7A1,1,0,0,0,4.93,4.93ZM18.37,17A1,1,0,0,0,17,18.37l.7.7a1,1,0,0,0,1.42,0,1,1,0,0,0,0-1.42ZM12,6a6,6,0,1,1-6,6A6,6,0,0,1,12,6ZM8,12a4,4,0,1,0,4-4A4,4,0,0,0,8,12Z"
        />
      </svg>
    </transition>
  </button>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';

const isDark = ref(false);
watch(isDark, val => {
  document.documentElement.classList.toggle('dark', val);
  localStorage.setItem('theme', val ? 'dark' : 'light');
});

onMounted(() => {
  const themeSetting = localStorage.getItem('theme');
  isDark.value = themeSetting === 'dark';
});
</script>

<style lang="postcss" scoped>
button {
  @apply outline-none items-center justify-center relative;
  min-width: 24px;
  min-height: 24px;
}

svg {
  @apply absolute;
}

@screen motion {
  .popup-enter-active,
  .popup-leave-active {
    transition: transform 0.5s ease-in-out, opacity 0.3s ease-in-out;
  }

  .popup-enter,
  .popup-leave-to {
    transform: translate3d(0, -50px, 0);
    opacity: 0;
  }
}
</style>
