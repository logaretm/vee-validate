const { rollup } = require('rollup');
const uglify = require('uglify-js');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const mkdirpNode = require('mkdirp');
const { promisify } = require('util');
const { configs, utils, paths, uglifyOptions } = require('./config');

const mkdirp = promisify(mkdirpNode);

async function build () {
  await mkdirp(paths.dist);
  console.log(chalk.cyan('Generating main builds...'));

  let bundle = await rollup(configs.umdDev.input);
  let { code } = await bundle.generate(configs.umdDev.output);

  // generate main bundle.
  let outputPath = path.join(paths.dist, 'vee-validate.js');
  fs.writeFileSync(outputPath, code);
  let stats = utils.stats({ code, path: outputPath });
  console.log(`${chalk.green('Output File:')} vee-validate.js ${stats}`);

  // generate minified bundle.
  bundle = await rollup(configs.umdProd.input);
  code = (await bundle.generate(configs.umdProd.output)).code;

  outputPath = path.join(paths.dist, 'vee-validate.min.js');
  fs.writeFileSync(outputPath, uglify.minify(code, uglifyOptions).code);
  stats = utils.stats({ code, path: outputPath });
  console.log(`${chalk.green('Output File:')} vee-validate.min.js ${stats}`);

  // generate minimal bundle
  bundle = await rollup(configs.umdMinimalDev.input);
  code = (await bundle.generate(configs.umdMinimalDev.output)).code;

  outputPath = path.join(paths.dist, 'vee-validate.minimal.js');
  fs.writeFileSync(outputPath, code);
  stats = utils.stats({ code, path: outputPath });
  console.log(`${chalk.green('Output File:')} vee-validate.minimal.js ${stats}`);

  // generate minified minimal bundle.
  bundle = await rollup(configs.umdMinimalProd.input);
  code = (await bundle.generate(configs.umdMinimalProd.output)).code;

  outputPath = path.join(paths.dist, 'vee-validate.minimal.min.js');
  fs.writeFileSync(outputPath, uglify.minify(code, uglifyOptions).code);
  stats = utils.stats({ code, path: outputPath });
  console.log(`${chalk.green('Output File:')} vee-validate.minimal.js ${stats}`);
}

build();
