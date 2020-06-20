const ts = require('typescript');
const chalk = require('chalk');
const path = require('path');
const fs = require('fs-extra');
const { rollup } = require('rollup');
const { default: dts } = require('rollup-plugin-dts');
const tsconfig = require('../tsconfig.json');
const { pkgNameMap } = require('./config');

exports.generateDts = async function generateDts(pkg) {
  console.log(chalk.cyan(`Generating Declaration Files for ${pkg} ...`));
  const declarationDir = `../packages/${pkg}/dist/types`;

  const options = {
    ...tsconfig,
    declaration: true,
    declarationMap: false,
    emitDeclarationOnly: true,
    declarationDir,
  };

  const host = ts.createCompilerHost(options);
  const createdFiles = {};
  host.writeFile = (fileName, contents) => {
    createdFiles[fileName] = contents;
  };

  // Prepare and emit the d.ts files
  const program = ts.createProgram([path.resolve(__dirname, `../packages/${pkg}/src/index.ts`)], options, host);
  program.emit();
  for (const [file, contents] of Object.entries(createdFiles)) {
    fs.outputFileSync(path.resolve(__dirname, file), contents);
  }

  await bundleDts(declarationDir, pkg);
};

async function bundleDts(declarationDir, pkg) {
  let entry = path.join(__dirname, declarationDir, 'index.d.ts');
  // if it doesn't exist then probably was nested cause of relative imports
  if (!fs.existsSync(entry)) {
    entry = path.resolve(__dirname, declarationDir, pkg, 'src', 'index.d.ts');
  }

  // If we cannot find the 'index.d.ts', panic!
  if (!fs.existsSync(entry)) {
    throw new Error('Cannot find index.d.ts at' + entry);
  }

  // Generate .d.ts rollup
  const config = {
    input: entry,
    output: { file: `packages/${pkg}/dist/${pkgNameMap[pkg]}.d.ts`, format: 'es' },
    plugins: [dts()],
  };

  const bundle = await rollup(config);
  await bundle.write(config.output);
  await fs.remove(`packages/${pkg}/dist/types`);
  console.log(`${chalk.cyan('Bundled ' + pkg + ' Declaration Files...')}`);
}
