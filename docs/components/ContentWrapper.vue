<template>
  <nuxt-content :document="document" attr="value" />
</template>

<script>
export default {
  props: ['document'],
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
    @apply font-semibold my-8 relative;
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

  p + p {
    @apply mt-4;
  }

  ul {
    @apply px-8 my-4 list-disc;

    li + li {
      @apply mt-2;
    }
  }

  .features {
    ul {
      li {
        @apply relative flex items-center;
        &:before {
          @apply w-5 h-5 absolute rounded-full flex text-accent-900 bg-accent-100 items-center justify-center;
          content: '✓';
          left: -2rem;
        }
      }
    }
  }

  .nuxt-content-highlight {
    @apply my-4 text-sm;
  }

  blockquote {
    @apply py-4 rounded-r-lg pl-4 bg-black border-l-4 border-accent-800 italic my-8 text-lg;
  }

  pre[class*='language-'] {
    @apply rounded-lg my-4 block border border-gray-100;
  }

  *:not(pre) > code:not([class]) {
    @apply text-sm px-1 rounded bg-gray-100 border border-gray-300 text-gray-500;
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

  /*
    Theme by vue-next docs
    https://github.com/vuejs/docs-next/blob/master/src/.vuepress/theme/styles/code.styl
  */
  code .token.deleted {
    color: #ec5975;
  }
  code .token.inserted {
    color: #0a7a34;
  }

  pre,
  pre[class*='language-'] {
    line-height: 1.4;
    padding: 1.25rem 1.5rem;
    margin: 0.85rem 0;
    background-color: #f6f6f6;
    border-radius: 6px;
    overflow: auto;
    position: relative;
  }
  pre code,
  pre[class*='language-'] code {
    color: #3a385d;
    padding: 0;
    background-color: transparent;
    border-radius: 0;
  }
  div[class*='language-'] {
    position: relative;
    background-color: #f6f6f6;
    border-radius: 6px;
  }
  div[class*='language-'] .highlight-lines {
    background-color: #f6f6f6;
    color: #3a385d;
    user-select: none;
    padding-top: 1.3rem;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    line-height: 1.4;
  }
  div[class*='language-'] .highlight-lines .highlighted {
    background-color: #f8ec06;
  }
  div[class*='language-'] pre,
  div[class*='language-'] pre[class*='language-'] {
    background: transparent;
    position: relative;
    z-index: 1;
  }

  *[class*='language-']::before {
    position: absolute;
    z-index: 3;
    top: 0.8em;
    right: 1em;
    font-size: 0.75rem;
    color: #00000c;
  }

  .language-html:before {
    content: 'html';
  }
  .language-js:before {
    content: 'js';
  }
  .language-ts:before {
    content: 'ts';
  }
  div[class~='language-javascript']:before {
    content: 'js';
  }
  div[class~='language-typescript']:before {
    content: 'ts';
  }
  div[class~='language-markup']:before {
    content: 'html';
  }
  div[class~='language-json']:before {
    content: 'json';
  }
  div.reactivecontent {
    width: 1000px;
    margin-left: -100px;
  }
  .token.punctuation {
    color: #a8a9cc;
  }
  .token.tag,
  .token.attr-name,
  .token.namespace,
  .token.deleted {
    color: #b2085f;
  }
  .token.string,
  .token.char,
  .token.attr-value,
  .token.regex,
  .token.variable {
    color: #0a7a34;
  }
  .token.selector,
  .token.important,
  .token.atrule,
  .token.keyword,
  .token.builtin {
    color: #b92dbc;
  }
  .token.boolean,
  .token.number,
  .token.function {
    color: #c25205;
  }
  .token.property,
  .token.class-name,
  .token.constant,
  .token.symbol {
    color: #717c11;
  }
  .token.operator,
  .token.entity,
  .token.url {
    color: #0b7e7d;
  }
  .token.comment,
  .token.block-comment,
  .token.prolog,
  .token.doctype,
  .token.cdata {
    color: #848486;
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

    pre,
    pre[class*='language-'] {
      line-height: 1.4;
      padding: 1.25rem 1.5rem;
      margin: 0.85rem 0;
      background-color: #22212c;
      border-radius: 6px;
      overflow: auto;
      position: relative;
    }
    pre code,
    pre[class*='language-'] code {
      color: #f8f8f2;
      padding: 0;
      background-color: transparent;
      border-radius: 0;
    }
    div[class*='language-'] {
      position: relative;
      background-color: #22212c;
      border-radius: 6px;
    }
    div[class*='language-'] .highlight-lines {
      background-color: #22212c;
      color: #f8f8f2;
      user-select: none;
      padding-top: 1.3rem;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      line-height: 1.4;
    }
    div[class*='language-'] .highlight-lines .highlighted {
      background-color: #f8ec06;
    }
    div[class*='language-'] pre,
    div[class*='language-'] pre[class*='language-'] {
      background: transparent;
      position: relative;
      z-index: 1;
    }

    *[class*='language-']::before {
      position: absolute;
      z-index: 3;
      top: 0.8em;
      right: 1em;
      font-size: 0.75rem;
      color: #00000c;
    }

    .language-html:before {
      content: 'html';
    }
    .language-js:before {
      content: 'js';
    }
    .language-ts:before {
      content: 'ts';
    }
    div[class~='language-javascript']:before {
      content: 'js';
    }
    div[class~='language-typescript']:before {
      content: 'ts';
    }
    div[class~='language-markup']:before {
      content: 'html';
    }
    div[class~='language-json']:before {
      content: 'json';
    }
    div.reactivecontent {
      width: 1000px;
      margin-left: -100px;
    }
    .token.punctuation {
      color: #f8f8f2;
    }
    .token.tag,
    .token.namespace,
    .token.deleted {
      color: #ff80bf;
    }

    .token.attr-name {
      color: #8aff80;
    }

    .token.string,
    .token.char,
    .token.attr-value,
    .token.regex,
    .token.variable {
      color: #ffff80;
    }
    .token.selector,
    .token.important,
    .token.atrule,
    .token.keyword,
    .token.builtin {
      color: #ff80bf;
    }

    .token.function {
      color: #8aff80;
    }

    .token.boolean,
    .token.number {
      color: #9580ff;
    }

    .token.property,
    .token.class-name,
    .token.constant,
    .token.symbol {
      color: #f8f8f2;
    }
    .token.operator,
    .token.entity,
    .token.url {
      color: #ff80bf;
    }
    .token.comment,
    .token.block-comment,
    .token.prolog,
    .token.doctype,
    .token.cdata {
      color: #7970a9;
    }

    pre code,
    pre[class*='language-'] code {
      color: #f8f8f2;
    }

    *[class*='language-']::before {
      color: #7970a9;
    }

    pre[class*='language-'] {
      @apply border-gray-600;
    }

    table,
    th,
    td {
      @apply border border-gray-600;
    }
  }
}
</style>
