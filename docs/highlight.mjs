import * as shiki from 'shiki';
import cheerio from 'cheerio';
import { visit } from 'unist-util-visit';
import theme from './theme.mjs';

export default function highlight() {
  return async function (tree) {
    const highlighter = await shiki.getHighlighter({
      // Complete themes: https://github.com/shikijs/shiki/tree/master/packages/themes
      theme,
      langs: ['js', 'ts', 'vue', 'graphql', 'jsx', 'css', 'sh', 'yaml', 'json', 'vue-html', 'html'],
    });

    visit(tree, 'code', visitor);

    function visitor(node) {
      const { lang, lines, fileName } = parseParts(node.lang || 'sh');
      try {
        const html = replaceColorsWithVariables(highlighter.codeToHtml(node.value, lang || 'sh'));
        const $ = cheerio.load(html);
        $('.shiki').attr('data-language', lang);
        $('.shiki').prepend(`<span class="shiki-language">${lang}</span>`);
        if (lines.length) {
          lines.forEach(line => {
            $(`.line:nth-child(${line})`).addClass('is-highlighted');
          });
          $('.shiki').addClass('with-line-highlights');
        }
        if (fileName) {
          $('.shiki').prepend(`<span class="filename">${fileName}</span>`);
          $('.shiki').addClass('with-filename');
        }
        $('.line:last-child:empty').remove();
        node.value = $.html($('.shiki'));
        node.type = 'html';
      } catch (err) {
        console.error(err);
        console.log(node.lang);
        process.exit(1);
      }
    }
  };

  // return (rawCode, lang, { fileName, lineHighlights }) => {

  // };
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
