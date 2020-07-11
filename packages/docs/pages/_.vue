<template>
  <nuxt-content :document="page" />
</template>

<script>
export default {
  async asyncData({ $content, params }) {
    const page = await $content(params.pathMatch || 'home').fetch();

    return {
      page,
    };
  },
};
</script>

<style lang="postcss">
h1 {
  @apply text-6xl;
}
h2 {
  @apply text-2xl;
}

h3 {
  @apply text-xl;
}

h1,
h2,
h3 {
  @apply font-display;
}

h2,
h3 {
  @apply font-semibold mb-3 mt-5 relative;
  &::before {
    @apply absolute text-accent;
    margin-left: -2ch;
    content: '#';
  }

  p + p {
    @apply mt-4;
  }

  ul {
    @apply px-8 my-4;
    list-style: initial;
  }

  blockquote {
    @apply py-4 rounded-r-lg pl-4 bg-black border-l-4 border-accent italic my-8 text-lg;
  }
}

.is-light {
  .content {
    blockquote {
      @apply bg-gray-lighter;
    }
  }
}

button {
  &.is-saved {
    @apply opacity-50 pointer-events-none;
  }
}

.Tag {
  @apply px-2 py-1 text-white rounded;
  background: rgb(9, 168, 132);
  background: linear-gradient(90deg, rgba(9, 168, 132, 1) 0%, rgba(40, 130, 130, 1) 100%);
}
</style>
