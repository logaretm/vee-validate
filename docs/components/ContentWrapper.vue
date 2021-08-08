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
    @apply my-4 text-sm relative;
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

  pre[class*='language-'] {
    @apply rounded-lg my-4 block border border-gray-100;
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
    @apply my-8 font-mono text-base px-4 pt-8 pb-4;
    padding-left: 3.8rem;
    line-height: 1.4;
    background-color: #f6f6f6;
    border-radius: 6px;
    overflow: auto;
  }

  pre code,
  pre[class*='language-'] code {
    color: #3a385d;
    padding: 0;
    background-color: transparent;
    border-radius: 0;
  }

  div[class*='language-'] {
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

  .line-highlight {
    @apply absolute right-0 left-0 bg-gray-300 opacity-30 select-none z-0 pointer-events-none;
    transform: translateY(calc(2rem - 2px));
  }

  .line-numbers {
    counter-reset: linenumber;
  }

  .line-numbers .line-numbers-rows {
    @apply top-8;
    position: absolute;
    pointer-events: none;
    left: 0;
    width: 3rem;
    letter-spacing: -1px;

    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  .line-numbers-rows > span {
    display: block;
    counter-increment: linenumber;
  }

  .line-numbers-rows > span:before {
    color: #848486;
    background-color: #f6f6f6;
    content: counter(linenumber);
    display: block;
    padding-right: 0.8em;
    text-align: right;
  }

  .language-html::before {
    content: 'html';
  }
  .language-js::before {
    content: 'js';
  }
  .language-ts::before {
    content: 'ts';
  }
  div[class~='language-javascript']::before {
    content: 'js';
  }
  div[class~='language-typescript']::before {
    content: 'ts';
  }
  div[class~='language-markup']::before {
    content: 'html';
  }
  div[class~='language-json']::before {
    content: 'json';
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
      background-color: #22212c;
    }
    pre code,
    pre[class*='language-'] code {
      color: #f8f8f2;
      background-color: transparent;
    }
    div[class*='language-'] {
      background-color: #22212c;
    }
    div[class*='language-'] .highlight-lines {
      background-color: #22212c;
      color: #f8f8f2;
    }
    div[class*='language-'] .highlight-lines .highlighted {
      background-color: #f8ec06;
    }

    *[class*='language-']::before {
      position: absolute;
      z-index: 3;
      top: 0.8em;
      right: 1em;
      font-size: 0.75rem;
      color: #00000c;
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

    .line-numbers-rows > span:before {
      color: #7970a9;
      background-color: #22212c;
    }

    .line-highlight {
      @apply bg-dracula-selection;
      mix-blend-mode: screen;
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
