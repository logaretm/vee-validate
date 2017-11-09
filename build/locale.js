const path = require('path');
const rollup = require('rollup');
const babel = require('rollup-plugin-babel');
const fs = require('fs');
const UglifyJS = require('uglify-js');

const babelConfig = {
  babelrc: false,
  exclude: 'node_modules/**',
  presets: [ [ 'es2015', { modules: false } ] ],
  plugins: [
    'external-helpers',
    'transform-async-to-generator',
    'transform-flow-strip-types',
    'lodash',
  ]
};

async function build () {
  const localesDir = path.join(__dirname, '../locale');
  const files = fs.readdirSync(localesDir);
  let cache;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];

    // ignore utils file.
    if (/utils/.test(file)) continue;

    const input = path.join(__dirname, '../locale', file);
    const output = path.join(__dirname, '../dist/locale', file);
    const bundle = await rollup.rollup({
      cache,
      input,
      external: ['VeeValidate'],
      plugins: [
        babel(babelConfig)
      ],
    });

    const { code } = await bundle.generate({
      format: 'umd',
      name: `__vee_validate_locale__${file}`,
    });

    const result = UglifyJS.minify(code, {
      compress: true,
      mangle: true,
    });

    fs.writeFileSync(output, result.code);
  }
}

build();
