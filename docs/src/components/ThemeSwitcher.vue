<template>
  <button class="opacity-50 transition-opacity duration-200 hover:opacity-100" @click="isDark = !isDark">
    <transition name="popup" mode="out-in">
      <Icon v-if="isDark" name="dark" class="w-6 h-6 fill-current text-white" />
      <Icon v-else name="light" class="w-6 h-6 fill-current text-dark" />
    </transition>
  </button>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import Icon from '@/components/Icon.vue';

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
