import fs from 'fs-extra';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

fs.copyFileSync(path.resolve(__dirname, '../README.md'), path.resolve(__dirname, '../packages/core/README.md'));
console.log(chalk.green('📄 README.md copied to packages/core'));

fs.copyFileSync(path.resolve(__dirname, '../LICENSE'), path.resolve(__dirname, '../packages/core/LICENSE'));
console.log(chalk.green('📄 LICENSE copied to packages/core'));

fs.copyFileSync(path.resolve(__dirname, '../packages/core/CHANGELOG.md'), path.resolve(__dirname, '../CHANGELOG.md'));
console.log(chalk.green('📄 CHANGELOG.md copied to root'));
