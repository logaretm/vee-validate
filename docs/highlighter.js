/* eslint-disable @typescript-eslint/no-var-requires */
/* taken from here https://github.com/nuxt/content/blob/35718b99fcc581073ea14afd6a7b5f16dbca9051/packages/content/parsers/markdown/handlers/code.js */
const Prism = require('prismjs');
const escapeHtml = require('escape-html');
const u = require('unist-builder');

require('prismjs/components/index')();

// enable syntax highlighting on diff language
require('prismjs/components/prism-diff');
require('prismjs/plugins/diff-highlight/prism-diff-highlight');
// enable line numbers
require('prismjs/plugins/line-numbers/prism-line-numbers');
// enable line highlights
require('prismjs/plugins/line-highlight/prism-line-highlight');

const DIFF_HIGHLIGHT_SYNTAX = /^(diff)-([\w-]+)/i;

// https://stackoverflow.com/questions/59508413/static-html-generation-with-prismjs-how-to-enable-line-numbers
const NEW_LINE_EXP = /\n(?!$)/g;
let lineNumbersWrapper;

Prism.hooks.add('after-tokenize', function (env) {
  const match = env.code.match(NEW_LINE_EXP);
  const linesNum = match ? match.length + 1 : 1;
  const lines = new Array(linesNum + 1).join('<span></span>');

  lineNumbersWrapper = `<span aria-hidden="true" class="line-numbers-rows">${lines}</span>`;
});

const prismHighlighter = (rawCode, language, { lineHighlights, fileName }, { h, node }) => {
  let lang = language || '';
  let grammer;

  const diffLanguage = lang.match(DIFF_HIGHLIGHT_SYNTAX);
  if (diffLanguage) {
    lang = diffLanguage[2];
    grammer = Prism.languages.diff;
  }

  lang = lang === 'vue' ? 'html' : lang;

  if (!grammer) {
    grammer = Prism.languages[lang];
  }

  const highlightLanguage = diffLanguage ? `diff-${lang}` : lang;
  let code = grammer ? Prism.highlight(rawCode, grammer, highlightLanguage) + lineNumbersWrapper : rawCode;

  if (!lang || !grammer) {
    lang = 'text';
    code = escapeHtml(code);
  }

  const props = {
    className: [`language-${lang}`, 'line-numbers'],
  };

  if (lineHighlights) {
    props.dataLine = lineHighlights;
  }

  const childs = [];

  /**
   * If filename, then set span as a first child
   */
  if (fileName) {
    childs.push(h(node, 'span', { className: ['filename'] }, [u('text', fileName)]));
  }

  /**
   * Set pre as a child
   */
  childs.push(h(node, 'pre', props, [h(node, 'code', [u('raw', code)])]));

  return h(node.position, 'div', { className: ['nuxt-content-highlight'] }, childs);
};

module.exports = {
  prismHighlighter,
};
