<template>
  <transition name="slide">
    <div class="SideMenu lg:hidden" v-if="isOpen">
      <DocMenu />
    </div>
  </transition>
</template>

<script>
// import Switcher from './Switcher';

export default {
  name: 'SideMenu',
  components: {
    // Switcher,
  },
  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
  },
  model: {
    prop: 'isOpen',
  },
  data: vm => ({}),
  watch: {
    $route() {
      this.closeMenu();
    },
    isOpen(val) {
      document.body.classList.toggle('overflow-hidden', val);
    },
  },
  beforeDestroy() {
    document.body.classList.remove('overflow-hidden');
  },
  methods: {
    closeMenu() {
      this.$emit('input', false);
    },
  },
};
</script>

<style lang="postcss" scoped>
.SideMenu {
  @apply fixed h-screen w-screen inset-0 z-20 overflow-y-auto bg-white text-gray-700 flex flex-col;
}

.dark {
  .SideMenu {
    @apply bg-gray-700 text-white;
  }
}

@screen motion {
  .slide-enter-active,
  .slide-leave-active {
    transition: transform 0.25s ease-in-out, opacity 0.25s ease-in-out;
  }
  .slide-enter,
  .slide-leave-to {
    opacity: 0;
    transform: translate3d(100%, 0, 0);
  }
}

nav {
  a {
    transition: color 0.3s ease-in-out;

    &::-moz-focus-inner {
      border: 0;
    }

    &:hover {
      @apply text-accent-800;
    }

    &:focus {
      @apply text-accent-800;
      outline: 2px dotted currentColor;
      outline-offset: 2px;
    }

    &::after {
      @apply absolute inset-0 w-full h-full;
      border: 6px solid transparent;
      transition: border-color 0.3s ease-in-out;
      content: '';
    }

    &.active {
      &::after {
        transition: border-color 0.3s ease-in-out;

        @apply border-accent-800;
      }
    }
  }
}

.FeedLink {
  min-width: 48px;
  min-height: 48px;
}
</style>
