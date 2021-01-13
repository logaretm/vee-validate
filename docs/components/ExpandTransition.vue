<template>
  <transition name="expand" :appear="appear" @enter="enter" @after-enter="afterEnter" @leave="leave">
    <slot />
  </transition>
</template>

<script>
export default {
  name: 'TransitionExpand',
  props: {
    appear: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    enter(element) {
      const width = getComputedStyle(element).width;

      element.style.width = width;
      element.style.position = 'absolute';
      element.style.visibility = 'hidden';
      element.style.height = 'auto';

      requestAnimationFrame(() => {
        const height = getComputedStyle(element).height;

        element.style.width = null;
        element.style.position = null;
        element.style.visibility = null;
        element.style.height = 0;

        requestAnimationFrame(() => {
          element.style.height = height;
        });
      });
    },
    afterEnter(element) {
      element.style.height = 'auto';
    },
    leave(element) {
      const height = getComputedStyle(element).height;

      element.style.height = height;

      // Force repaint to make sure the
      // animation is triggered correctly.
      // eslint-disable-next-line no-unused-expressions
      getComputedStyle(element).height;

      setTimeout(() => {
        element.style.height = 0;
      });
    },
  },
};
</script>

<style lang="postcss" scoped>
.expand-enter-active,
.expand-leave-active {
  transition-property: opacity, height;
  transition-duration: 0.3s;
  transition-timing-function: ease-in-out;
  overflow: hidden;
}

.expand-enter,
.expand-leave-to {
  height: 0;
}

* {
  will-change: height;
  transform: translateZ(0);
  backface-visibility: hidden;
  perspective: 1000px;
}
</style>
