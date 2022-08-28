<template>
  <slot name="trigger" :toggle="onMenuToggle" :isOpen="isOpen" />

  <div ref="menuRef" class="fixed z-40 max-w-xs top-0 left-0">
    <transition name="menu">
      <div
        v-if="isOpen"
        class="bg-white shadow border border-gray-200 dark:bg-zinc-800 dark:border-zinc-700 p-3 rounded-md"
      >
        <slot name="menu" />
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { onClickOutside } from '@vueuse/core';
import { computePosition, Placement, offset } from '@floating-ui/dom';

const props = defineProps<{
  placement?: Placement;
}>();

const menuRef = ref<HTMLElement>();
const isOpen = ref(false);

async function updateStyle(reference: HTMLElement) {
  if (!menuRef.value) {
    return;
  }

  const { x, y } = await computePosition(reference, menuRef.value, {
    strategy: 'fixed',
    placement: props.placement || 'bottom',
    middleware: [offset({ mainAxis: 10 })],
  });

  console.log(reference.getBoundingClientRect(), reference, x, y);
  menuRef.value.style.transform = `translate3d(${Math.round(x)}px, ${Math.round(y)}px, 0)`;
}

function onMenuToggle(e: Event) {
  isOpen.value = !isOpen.value;
  if (isOpen.value) {
    updateStyle(e.target as HTMLElement);
  }
}

onClickOutside(menuRef, () => {
  isOpen.value = false;
});
</script>

<style scoped lang="postcss">
.menu-enter-active,
.menu-leave-active {
  transition: opacity 0.2s ease-in-out, transform 0.2s ease-in-out;
}

.menu-enter-from,
.menu-leave-to {
  opacity: 0;
  transform: scale(0.8);
}
</style>
