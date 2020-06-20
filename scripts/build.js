const path = require('path');
const fs = require('fs-extra');
const chalk = require('chalk');
const { createConfig } = require('./config');
const { reportSize } = require('./info');
const { generateDts } = require('./generate-dts');

async function buildLocales() {
  const localesDir = path.join(__dirname, '../packages/i18n/src/locale');
  const files = fs.readdirSync(localesDir);
  // eslint-disable-next-line
  console.log(chalk.cyan('Building i18n...'));

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    process.stdout.write(`${chalk.green(`Output File ${i}/${files.length}: `)} ${file}`);

    const input = path.join(__dirname, '../packages/i18n/src/locale', file);
    const out = path.join(__dirname, '../packages/i18n/dist/locale', file);
    fs.copySync(input, out);
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
  }
}

const { rollup } = require('rollup');

async function build(pkg) {
  const pkgout = path.join(__dirname, `../packages/${pkg}/dist`);
  for (const format of ['es', 'umd']) {
    const { input, output, bundleName } = createConfig(pkg, format);
    const bundle = await rollup(input);
    const {
      output: [{ code }],
    } = await bundle.generate(output);

    const outputPath = path.join(pkgout, bundleName);
    console.log(outputPath);
    fs.outputFileSync(outputPath, code);
    const stats = reportSize({ code, path: outputPath });
    // eslint-disable-next-line
    console.log(`${chalk.green('Output File:')} ${bundleName} ${stats}`);
  }

  await generateDts(pkg);

  return true;
}

(async function Bundle() {
  await build('core');
  await build('rules');
  await build('yup');
  await build('i18n');
  await buildLocales();
})();
