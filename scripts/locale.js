const { rollup } = require('rollup');
const buble = require('rollup-plugin-buble');
const uglify = require('uglify-js');
const fs = require('fs');
const path = require('path');
const mkdirpNode = require('mkdirp');
const { promisify } = require('util');
const chalk = require('chalk');
const resolve = require('rollup-plugin-node-resolve');
const { paths, uglifyOptions } = require('./config');

const localesDir = path.join(__dirname, '..', 'locale');
const files = fs.readdirSync(localesDir);
let cache;

const mkdirp = promisify(mkdirpNode);

async function build () {
  await mkdirp(path.join(paths.dist, 'locale'));
  console.log(chalk.cyan('Building locales...'));

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    process.stdout.write(`${chalk.green(`Output File ${i}/${files.length}: `)} ${file}`);

    // ignore utils file.
    if (/utils/.test(file)) continue;

    const input = path.join(__dirname, '..', 'locale', file);
    const output = path.join(paths.dist, 'locale', file);

    const bundle = await rollup({
      cache,
      input,
      external: ['VeeValidate'],
      plugins: [buble(), resolve()],
    });
    const { code } = await bundle.generate({
      format: 'umd',
      name: `__vee_validate_locale__${file}`,
    });

    fs.writeFileSync(output, uglify.minify(code, uglifyOptions).code);
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
  }
}

build();
