<template>
  <nuxt-content :document="page" />
</template>

<script>
import { store } from '@/plugins/appstate';
import { slugify } from '@/utils/string';

export default {
  async asyncData({ $content, params }) {
    const page = await $content(params.pathMatch || 'home').fetch();

    return {
      page,
    };
  },
  mounted() {
    function linkify(node) {
      const anchor = document.createElement('a');
      const slug = slugify(node.textContent);
      anchor.href = `#${slug}`;
      anchor.textContent = node.textContent;
      node.id = slug;
      node.textContent = '';
      node.appendChild(anchor);
    }

    Array.from(this.$el.querySelectorAll('h2')).forEach(linkify);
    Array.from(this.$el.querySelectorAll('h3')).forEach(linkify);
    // set the current document
    store.currentDoc = this.page;
  },
};
</script>

<style lang="postcss" scoped>
* >>> {
  h1 {
    @apply text-4xl mb-8;
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
    @apply font-semibold my-5 relative;
    &::before {
      @apply absolute text-accent;
      margin-left: -2ch;
      content: '#';
    }
  }

  p + p {
    @apply mt-4;
  }

  ul {
    @apply px-8 my-4;

    li + li {
      @apply mt-2;
    }

    li {
      @apply relative flex items-center;
      &:before {
        @apply w-5 h-5 absolute rounded-full flex text-accent-darker bg-accent-lighter items-center justify-center;
        content: '✓';
        left: -2rem;
      }
    }
  }

  blockquote {
    @apply py-4 rounded-r-lg pl-4 bg-black border-l-4 border-accent italic my-8 text-lg;
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

  pre[class*='language-'] {
    @apply rounded-lg my-4 block shadow-lg;
  }

  *:not(pre) > code:not([class]) {
    @apply px-2 text-white;
    background: rgb(9, 168, 132);
    background: linear-gradient(to right, #009f53, #05b769);
  }

  details {
    @apply my-10 border-l-4 border-accent-darker pl-3;

    summary {
      @apply mb-8;
    }
  }

  code[class*='language-'],
  pre[class*='language-'] {
    background-color: #070707;
    text-shadow: none;
    color: #d6deeb;
    font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;
    text-align: left;
    white-space: pre;
    word-spacing: normal;
    word-break: normal;
    word-wrap: normal;
    line-height: 1.5;

    -moz-tab-size: 4;
    -o-tab-size: 4;
    tab-size: 4;

    -webkit-hyphens: none;
    -moz-hyphens: none;
    -ms-hyphens: none;
    hyphens: none;
  }

  pre[class*='language-']::-moz-selection,
  pre[class*='language-'] ::-moz-selection,
  code[class*='language-']::-moz-selection,
  code[class*='language-'] ::-moz-selection {
    text-shadow: none;
    background: rgba(29, 59, 83, 0.99);
  }

  pre[class*='language-']::selection,
  pre[class*='language-'] ::selection,
  code[class*='language-']::selection,
  code[class*='language-'] ::selection {
    text-shadow: none;
    background: rgba(29, 59, 83, 0.99);
  }

  @media print {
    code[class*='language-'],
    pre[class*='language-'] {
      text-shadow: none;
    }
  }

  /* Code blocks */
  pre {
    padding: 1em;
    margin: 0.5em 0;
    overflow: auto;
  }

  :not(pre) > code,
  pre {
    color: white;
    background: #011627;
  }

  :not(pre) > code {
    padding: 0.1em;
    border-radius: 0.3em;
    white-space: normal;
  }

  .token.comment,
  .token.prolog,
  .token.cdata {
    color: rgb(99, 119, 119);
    font-style: italic;
  }

  .token.punctuation {
    color: rgb(199, 146, 234);
  }

  .namespace {
    color: rgb(178, 204, 214);
  }

  .token.deleted {
    color: rgba(239, 83, 80, 0.56);
    font-style: italic;
  }

  .token.symbol,
  .token.property {
    color: rgb(128, 203, 196);
  }

  .token.tag,
  .token.operator,
  .token.keyword {
    color: rgb(127, 219, 202);
    background: transparent;
  }

  .token.boolean {
    color: rgb(255, 88, 116);
  }

  .token.number {
    color: rgb(247, 140, 108);
  }

  .token.constant,
  .token.function,
  .token.builtin,
  .token.char {
    color: rgb(130, 170, 255);
  }

  .token.selector,
  .token.doctype {
    color: rgb(199, 146, 234);
    font-style: italic;
  }

  .token.attr-name,
  .token.inserted {
    color: rgb(173, 219, 103);
    font-style: italic;
  }

  .token.string,
  .token.url,
  .token.entity,
  .language-css .token.string,
  .style .token.string {
    color: rgb(173, 219, 103);
  }

  .token.class-name,
  .token.atrule,
  .token.attr-value {
    color: rgb(255, 203, 139);
  }

  .token.regex,
  .token.important,
  .token.variable {
    color: rgb(214, 222, 235);
  }

  .token.important,
  .token.bold {
    font-weight: bold;
  }

  .token.italic {
    font-style: italic;
  }
}
</style>
