/* eslint-disable @typescript-eslint/no-var-requires */
/* taken from here https://github.com/nuxt/content/blob/35718b99fcc581073ea14afd6a7b5f16dbca9051/packages/content/parsers/markdown/handlers/code.js */
const shiki = require('shiki');
const cheerio = require('cheerio');

async function highlighter() {
  const highlighter = await shiki.getHighlighter({
    // Complete themes: https://github.com/shikijs/shiki/tree/master/packages/themes
    theme: require('./theme.json'),
    langs: ['js', 'ts', 'vue', 'css', 'sh', 'html', 'json', 'diff'],
  });

  return (rawCode, lang, { fileName, lineHighlights }) => {
    try {
      const html = replaceColorsWithVariables(highlighter.codeToHtml(rawCode, lang || 'sh'));
      const $ = cheerio.load(html);

      $('.shiki').attr('data-language', lang);
      $('.shiki').prepend(`<span class="shiki-language">${lang}</span>`);

      if (lineHighlights) {
        const lines = parseLines(lineHighlights);
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

      return $.html($('.shiki'));
    } catch (err) {
      console.error(err);

      process.exit(1);
    }
  };
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

module.exports = {
  highlighter,
};
