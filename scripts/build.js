const path = require('path');
const fs = require('fs-extra');
const { rollup } = require('rollup');
const chalk = require('chalk');
const Terser = require('terser');
const { createConfig } = require('./config');
const { reportSize } = require('./info');
const { generateDts } = require('./generate-dts');

async function buildLocales() {
  const localesDir = path.join(__dirname, '../packages/i18n/src/locale');
  const files = fs.readdirSync(localesDir);
  console.log(chalk.cyan('Building i18n...'));

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    process.stdout.write(`${chalk.green(`Output File ${i}/${files.length}: `)} ${file}`);

    const input = path.join(__dirname, '../packages/i18n/src/locale', file);
    const out = path.join(__dirname, '../packages/i18n/dist/locale', file);
    fs.copySync(input, out);
    console.log('/n');
  }
}

async function minify({ code, pkg, bundleName }) {
  const pkgout = path.join(__dirname, `../packages/${pkg}/dist`);
  const output = await Terser.minify(code, {
    compress: true,
    mangle: true,
  });

  const fileName = bundleName.replace(/\.js$/, '.min.js');
  const filePath = `${pkgout}/${fileName}`;
  fs.outputFileSync(filePath, output.code);
  const stats = reportSize({ code: output.code, path: filePath });
  console.log(`${chalk.green('Output File:')} ${fileName} ${stats}`);
}

async function build(pkg) {
  console.log(chalk.magenta(`Generating bundle for ${pkg}`));
  const pkgout = path.join(__dirname, `../packages/${pkg}/dist`);
  for (const format of ['es', 'umd']) {
    const { input, output, bundleName } = createConfig(pkg, format);
    const bundle = await rollup(input);
    const {
      output: [{ code }],
    } = await bundle.generate(output);

    const outputPath = path.join(pkgout, bundleName);
    fs.outputFileSync(outputPath, code);
    const stats = reportSize({ code, path: outputPath });
    // eslint-disable-next-line
    console.log(`${chalk.green('Output File:')} ${bundleName} ${stats}`);

    if (format === 'umd') {
      await minify({ bundleName, pkg, code });
    }
  }

  await generateDts(pkg);
  console.log(`${chalk.magenta('✅ Bundled ' + pkg)}`);

  return true;
}

(async function Bundle() {
  const arg = [...process.argv][2];
  if (arg === 'vee-validate' || !arg) {
    await build('vee-validate');
  }

  if (arg === 'rules' || !arg) {
    await build('rules');
  }

  if (arg === 'zod' || !arg) {
    await build('zod');
  }

  if (arg === 'yup' || !arg) {
    await build('yup');
  }

  if (arg === 'i18n' || !arg) {
    await build('i18n');
    await buildLocales();
  }
})();
