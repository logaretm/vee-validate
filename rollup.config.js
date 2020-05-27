/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const fs = require('fs-extra');
const { rollup } = require('rollup');
const filesize = require('filesize');
const chalk = require('chalk');
const gzipSize = require('gzip-size');
const typescript = require('rollup-plugin-typescript2');
const replace = require('rollup-plugin-replace');
const ts = require('typescript');
const { Extractor, ExtractorConfig } = require('@microsoft/api-extractor');

const version = process.env.VERSION || require(path.resolve(__dirname, '/package.json')).version;

const commons = {
  banner: `/**
  * @vee-validate/rules v${version}
  * (c) ${new Date().getFullYear()} Abdelrahman Awad
  * @license MIT
  */`,
  uglifyOptions: {
    compress: true,
    mangle: true,
  },
};

const formatMap = {
  es: 'esm',
  umd: '',
};

const formatNameMap = {
  core: 'VeeValidate',
  rules: 'VeeValidateRules',
  yup: 'VeeValidateYupAdapter',
};

const pkgNameMap = {
  core: 'vee-validate',
  rules: 'rules',
  yup: 'yup',
};

function createConfig(pkg, format) {
  const tsPlugin = typescript({
    tsconfig: path.resolve(__dirname, 'tsconfig.json'),
    cacheRoot: path.resolve(__dirname, 'node_modules/.rts2_cache'),
    tsconfigOverride: {
      exclude: ['**/tests'],
    },
  });

  const config = {
    input: {
      input: `packages/${pkg}/src/index.ts`,
      external: ['vue'],
      plugins: [tsPlugin, replace({ __VERSION__: version })],
    },
    output: {
      banner: commons.banner,
      format,
      name: format === 'umd' ? formatNameMap[pkg] : undefined,
      globals: {
        vue: 'Vue',
      },
    },
  };

  // if (options.env) {
  //   config.input.plugins.unshift(
  //     replace({
  //       'process.env.NODE_ENV': JSON.stringify(options.env)
  //     })
  //   );
  // }

  return config;
}

function reportSize({ path, code }) {
  const { size } = fs.statSync(path);
  const gzipped = gzipSize.sync(code);

  return `| Size: ${filesize(size)} | Gzip: ${filesize(gzipped)}`;
}

async function build(pkg) {
  const pkgout = path.join(__dirname, `packages/${pkg}/dist`);
  for (const format of ['es', 'umd']) {
    const { input, output } = createConfig(pkg, format);
    const bundle = await rollup(input);
    const {
      output: [{ code }],
    } = await bundle.generate(output);

    const bundleName = `${pkgNameMap[pkg]}${formatMap[format] ? '.' + formatMap[format] : ''}.js`;
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

async function generateDts(pkg) {
  console.log(`${chalk.cyan('Generating Declaration Files...')}`);
  const tsconfig = require('./tsconfig.json');
  await compileDts(pkg, {
    ...tsconfig,
    declaration: true,
    declarationMap: true,
    emitDeclarationOnly: true,
    declarationDir: `packages/${pkg}/dist/types`,
  });

  // Generate .d.ts rollup
  const extractorConfigPath = path.resolve(`packages/${pkg}`, `api-extractor.json`);
  const extractorConfig = ExtractorConfig.loadFileAndPrepare(extractorConfigPath);
  const result = Extractor.invoke(extractorConfig, {
    localBuild: true,
    showVerboseMessages: true,
  });

  if (!result.succeeded) {
    console.error(`API Extractor completed with ${result.errorCount} errors` + ` and ${result.warningCount} warnings`);
    process.exitCode = 1;
  }
}

async function compileDts(pkg, options) {
  // Create a Program with an in-memory emit
  const createdFiles = {};
  const host = ts.createCompilerHost(options);
  host.writeFile = (fileName, contents) => (createdFiles[fileName] = contents);

  // Prepare and emit the d.ts files
  const program = ts.createProgram([`packages/${pkg}/src/index.ts`], options, host);
  program.emit();
  for (const [file, contents] of Object.entries(createdFiles)) {
    fs.outputFileSync(path.resolve(__dirname, file), contents);
  }
}

module.exports = {
  build,
};
