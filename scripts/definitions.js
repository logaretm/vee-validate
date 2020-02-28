const fs = require('fs-extra');
const path = require('path');
const { paths } = require('./config');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

const pathTypes = path.join(paths.dist, 'types');
const pathTypesSrc = path.join(paths.dist, 'types/src');

const pathRulesSrc = path.join(paths.dist, 'types/rules/index.d.ts');
const pathRulesDist = path.join(paths.dist, 'rules.d.ts');

async function definitions() {
  try {
    await exec('tsc -v');

    console.log('Removing old declarations...');
    await fs.emptyDir(pathTypes);
    console.log('Done\n');

    console.log('Generating main declarations...');
    await exec('tsc --emitDeclarationOnly');
    console.log('Done\n');

    console.log('Cleaning up declaration folder...');
    await fs.copy(pathTypesSrc, pathTypes);
    await fs.remove(pathTypesSrc);
    console.log('Done\n');
    console.log('Copying rule declarations...');
    await fs.copy(pathRulesSrc, pathRulesDist);
    console.log('Done\n');

    console.log('Replacing definitions...');
    await exec('node ./scripts/replaceDefs.js');
    console.log('Done\n');
  } catch (error) {
    console.error(error);
  }
}

definitions();
