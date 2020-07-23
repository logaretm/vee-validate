<template>
  <nuxt-content :document="document" />
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

  h1,
  h2,
  h3 {
    @apply font-display;
  }

  h2,
  h3,
  h4 {
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
    @apply text-sm px-1 rounded bg-gray-100 border border-gray-200 text-gray-900;
  }

  details {
    @apply my-10 border-l-4 border-accent-900 pl-3;

    summary {
      @apply mb-8;
    }
  }

  p,
  li {
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
    color: #f00;
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

  div[class*='language-']:not(.line-numbers-mode) .line-numbers-wrapper {
    display: none;
  }
  div[class*='language-'].line-numbers-mode .highlight-lines .highlighted {
    position: relative;
  }
  div[class*='language-'].line-numbers-mode .highlight-lines .highlighted:before {
    content: ' ';
    position: absolute;
    z-index: 3;
    left: 0;
    top: 0;
    display: block;
    width: $lineNumbersWrapperWidth;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.95);
  }
  div[class*='language-'].line-numbers-mode pre {
    padding-left: 1rem;
    vertical-align: middle;
  }
  div[class*='language-'].line-numbers-mode .line-numbers-wrapper {
    position: absolute;
    top: 0;
    width: 1rem;
    text-align: center;
    color: rgba(255, 255, 255, 0.3);
    padding: 1.25rem 0;
    line-height: 1.4;
  }
  div[class*='language-'].line-numbers-mode .line-numbers-wrapper br {
    user-select: none;
  }
  div[class*='language-'].line-numbers-mode .line-numbers-wrapper .line-number {
    position: relative;
    z-index: 4;
    user-select: none;
    font-size: 0.85em;
  }
  div[class*='language-'].line-numbers-mode::after {
    content: '';
    position: absolute;
    z-index: 2;
    top: 0;
    left: 0;
    width: 1rem;
    height: 100%;
    border-radius: 6px 0 0 6px;
    border-right: 1px solid rgba(0, 0, 0, 0.66);
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

.is-dark {
  * >>> {
    *:not(pre) > code:not([class]) {
      @apply px-1 bg-black border border-gray-900 text-gray-200;
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

    pre code,
    pre[class*='language-'] code {
      color: #d6deeb;
    }

    *[class*='language-']::before {
      @apply text-carbon;
    }

    pre[class*='language-'] {
      @apply border-carbon;
    }

    table,
    th,
    td {
      @apply border border-carbon;
    }
  }
}
</style>
