const path = require('path');
const fs = require('fs');
const { rollup } = require('rollup');
const filesize = require('filesize');
const chalk = require('chalk');
const gzipSize = require('gzip-size');
const typescript = require('rollup-plugin-typescript2');
const replace = require('rollup-plugin-replace');
const mkdirp = require('mkdirp');
const { Extractor, ExtractorConfig } = require('@microsoft/api-extractor');

const version = process.env.VERSION || require(__dirname + '/package.json').version;

const commons = {
  banner: `/**
  * @vee-validate/rules v${version}
  * (c) ${new Date().getFullYear()} Abdelrahman Awad
  * @license MIT
  */`,
  uglifyOptions: {
    compress: true,
    mangle: true
  }
};

const formatMap = {
  es: 'esm',
  umd: ''
};

const formatNameMap = {
  core: 'VeeValidate',
  rules: 'VeeValidateRules'
};

const pkgNameMap = {
  core: 'vee-validate',
  rules: 'rules'
};

const tsPlugin = typescript({
  tsconfig: path.resolve(__dirname, 'tsconfig.json'),
  cacheRoot: path.resolve(__dirname, 'node_modules/.rts2_cache'),
  tsconfigOverride: {
    compilerOptions: {
      declaration: true,
      declarationMap: true
    },
    exclude: ['**/tests']
  }
});

function createConfig(pkg, format) {
  const config = {
    input: {
      input: `packages/${pkg}/src/index.ts`,
      external: ['vue'],
      plugins: [tsPlugin, replace({ __VERSION__: version })]
    },
    output: {
      banner: commons.banner,
      format,
      name: format === 'umd' ? formatNameMap[pkg] : undefined,
      globals: {
        vue: 'Vue'
      }
    }
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
  await mkdirp(pkgout);
  for (const format of ['es', 'umd']) {
    const { input, output } = createConfig(pkg, format);
    const bundle = await rollup(input);
    const {
      output: [{ code }]
    } = await bundle.generate(output);

    const bundleName = `${pkgNameMap[pkg]}${formatMap[format] ? '.' + formatMap[format] : ''}.js`;
    let outputPath = path.join(pkgout, bundleName);
    console.log(outputPath);
    fs.writeFileSync(outputPath, code);
    let stats = reportSize({ code, path: outputPath });
    // eslint-disable-next-line
    console.log(`${chalk.green('Output File:')} ${bundleName} ${stats}`);

    // Generate .d.ts rollup
    const extractorConfigPath = path.resolve(`packages/${pkg}`, `api-extractor.json`);
    const extractorConfig = ExtractorConfig.loadFileAndPrepare(extractorConfigPath);
    const result = Extractor.invoke(extractorConfig, {
      localBuild: true,
      showVerboseMessages: true
    });

    if (!result.succeeded) {
      console.error(
        `API Extractor completed with ${result.errorCount} errors` + ` and ${extractorResult.warningCount} warnings`
      );
      process.exitCode = 1;
    }
  }

  return true;
}

module.exports = {
  build
};
