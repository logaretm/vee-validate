import * as shiki from 'shiki';
import { JSDOM } from 'jsdom';
import { visit } from 'unist-util-visit';
import theme from './theme.json';

const dom = new JSDOM();
const document = dom.window.document;

/**
 * Some langs are highlighted with different grammar rules but need to be displayed
 */
const LANG_REPLACEMENTS = {
  'vue-html': 'vue',
};

const highlighterPromise = shiki.getHighlighter({
  // Complete themes: https://github.com/shikijs/shiki/tree/master/packages/themes
  theme: theme as any,
  langs: ['js', 'ts', 'vue', 'graphql', 'jsx', 'css', 'sh', 'yaml', 'json', 'vue-html', 'html'],
});

export default function highlight() {
  return async function (tree) {
    const highlighter = await highlighterPromise;
    visit(tree, 'code', visitor);

    function visitor(node) {
      const { lang, lines, fileName } = parseParts(node.lang || 'sh');
      try {
        const html = replaceColorsWithVariables(highlighter.codeToHtml(node.value, { lang: lang || 'sh' }));
        const fragment = document.createDocumentFragment();
        const wrapper = document.createElement('div');
        wrapper.classList.add('shiki-snippet');
        wrapper.innerHTML = html;
        fragment.appendChild(wrapper);

        const langSpan = createSpan(LANG_REPLACEMENTS[lang] || lang, 'shiki-language', {
          'data-language': lang,
        });
        const shikiEl = fragment.querySelector('.shiki') as HTMLElement | null;
        shikiEl?.prepend(langSpan);

        if (lines.length) {
          lines.forEach(line => {
            const lineEl = fragment.querySelector(`.line:nth-child(${line})`) as HTMLElement | null;
            lineEl?.classList.add('is-highlighted');
          });
          shikiEl?.classList.add('with-line-highlights');
        }
        fragment.querySelector('.line:last-child:empty')?.remove();
        if ([...fragment.querySelectorAll('.line')].length === 1) {
          shikiEl?.classList.add('single-line');
        }

        if (fileName) {
          wrapper.prepend(createSpan(fileName, 'filename'));
          shikiEl?.classList.add('with-filename');
        }
        node.value = fragment.querySelector('.shiki-snippet')?.outerHTML;
        node.type = 'html';
      } catch (err) {
        console.error(err);
        console.log(node.lang);
      }
    }
  };
}

function createSpan(text: string, className: string, attrs?: Record<string, string>) {
  const document = dom.window.document;

  const span = document.createElement('span');
  span.textContent = text;
  span.classList.add(className);
  if (attrs) {
    Object.keys(attrs).forEach(attr => {
      span.setAttribute(attr, attrs[attr]);
    });
  }

  return span;
}

function replaceColorsWithVariables(html) {
  const colors = [
    { variable: '--code-foreground', value: '#f8f8f2' },
    { variable: '--code-background', value: '#22212c' },
    { variable: '--code-token-constant', value: '#9580ff' },
    { variable: '--code-token-operator', value: '#ff80bf' },
    { variable: '--code-token-type', value: '#80ffea' },
    { variable: '--code-token-parameter', value: '#ffca80' },
    { variable: '--code-token-attribute', value: '#8aff80' },
    { variable: '--code-token-regex', value: '#ff9580' },
    { variable: '--code-token-string', value: '#ffff80' },
    { variable: '--code-token-comment', value: '#7970a9' },
  ];

  let str = html;
  colors.forEach(color => {
    str = str.replace(new RegExp(`color:\\s*${color.value}`, 'ig'), `color: var(${color.variable})`);
  });

  return str;
}

function parseLines(lines) {
  return lines.split(',').reduce((acc, line) => {
    if (/-/.test(line)) {
      const [start, end] = line.split('-').map(ln => Number(ln));
      let current = start;
      while (current <= end) {
        acc.push(current);
        current++;
      }

      return acc;
    }

    acc.push(Number(line));

    return acc;
  }, []);
}

const fileNameRE = /\[(.+)\]/;
const linesRE = /\{(.+)\}/;

function parseParts(lang) {
  lang = lang.trim();
  const [, fileName] = lang.match(fileNameRE) || [];
  const [, lines] = lang.match(linesRE) || [];
  const rawLang = lang.replace(fileNameRE, '').replace(linesRE, '');

  return {
    lang: rawLang,
    lines: lines ? parseLines(lines.replace()) : [],
    fileName,
  };
}
