<template>
  <nuxt-content :document="document" class="content" />
</template>

<script>
export default {
  props: ['document'],
};
</script>

<style lang="postcss" scoped>
.content {
  @apply overflow-y-hidden;
}
* >>> {
  p {
    @apply text-lg antialiased;
  }

  h1 {
    @apply text-4xl mb-8;
  }

  h2 {
    @apply text-3xl lg:text-xl;
  }

  h3 {
    @apply text-xl lg:text-lg;
  }

  h4 {
    @apply text-lg;
  }

  h5 {
    @apply text-base;
  }

  h1,
  h2,
  h3 {
    @apply font-display;
  }

  h2,
  h3,
  h4,
  h5 {
    @apply font-semibold my-8 relative w-max;
    transform: translateX(2ch);
    &::before {
      @apply absolute text-accent-800;
      margin-left: -2ch;
      content: '#';
    }

    a {
      @apply absolute inset-0;

      &:focus {
        @apply outline-none border-b-2 border-dotted;
      }
    }
  }

  h2 + h2,
  h2 + h3,
  h3 + h3,
  h3 + h4,
  h4 + h4,
  h4 + h5,
  h5 + h5 {
    &::after {
      content: '';
      display: block;
    }
  }

  p + p {
    @apply mt-4;
  }

  ul {
    @apply px-8 my-4 list-disc;

    li {
      @apply text-lg antialiased;
    }

    li + li {
      @apply mt-2;
    }
  }

  .features {
    ul {
      li {
        @apply relative flex items-center antialiased;
        &:before {
          @apply w-5 h-5 text-lg absolute rounded-full flex text-accent-900 bg-accent-100 items-center justify-center flex-shrink-0;
          content: '✓';
          left: -2rem;
        }
      }
    }
  }

  .nuxt-content-highlight {
    @apply my-8  relative;
  }

  .shiki {
    code {
      @apply text-lg lg:text-base;
    }

    @apply my-8 font-mono py-8;
    counter-reset: step;
    counter-increment: step 0;
    line-height: 1.4;
    border-radius: 6px;
    overflow: auto;

    code {
      @apply flex flex-col w-full;
    }

    &-language {
      @apply absolute right-4 top-4 text-xs;
      color: var(--code-lang-label);
    }

    &.with-filename {
      margin-top: 60px;

      .shiki-language {
        top: -0.5rem;
      }
    }

    &.with-line-highlights {
      .line {
        @apply transition-all duration-300;
      }

      .line:not(.is-highlighted) {
        @apply filter grayscale opacity-40 brightness-100;
      }

      &:hover {
        .line:not(.is-highlighted) {
          @apply filter-none opacity-100;
        }

        .line.is-highlighted {
          background-color: var(--code-line-highlight);
        }
      }
    }

    .line {
      @apply block pr-2;
      padding-left: 1.4rem;
      line-height: 1.6;

      &::before {
        @apply select-none;
        content: counter(step);
        counter-increment: step;
        width: 1rem;
        border-left: 0.2rem transparent solid;
        margin-right: 1.3rem;
        display: inline-block;
        text-align: right;
        color: var(--code-line-numbers);
      }

      &.is-highlighted {
        padding-left: 0;

        &::before {
          padding-left: 1.4rem;
          margin-right: 2rem;
          border-color: var(--code-line-highlight-border);
        }
      }
    }
  }

  iframe {
    @apply my-10;
  }

  video {
    @apply my-5 rounded-lg shadow-lg;
  }

  blockquote {
    @apply py-4 rounded-r-lg pl-4 bg-black border-l-4 border-accent-800 italic my-8 text-lg;
  }

  *:not(pre) > code:not([class]) {
    @apply font-mono text-base p-1 rounded bg-gray-100 border border-gray-300 text-gray-500;
  }

  details {
    @apply my-10 px-3;

    summary {
      @apply outline-none mb-8;
    }
  }

  ol {
    @apply list-decimal px-8;
  }

  p,
  li,
  td {
    a[href] {
      @apply text-accent-800;

      &:hover {
        @apply underline;
      }
    }
  }

  table {
    @apply w-full my-4;
  }

  table,
  th,
  td {
    @apply border border-gray-100;
  }

  th,
  td {
    @apply p-3;
  }
}

.dark {
  * >>> {
    *:not(pre) > code:not([class]) {
      @apply px-1 bg-black border border-gray-500 text-gray-300;
    }

    table,
    th,
    td {
      @apply border border-gray-600;
    }
  }
}
</style>
