import { version } from '../packages/core/package.json';
import { execSync } from 'node:child_process';
import chalk from 'chalk';

try {
  execSync(`git tag v${version}`);
  console.log(chalk.green(`🔖 Tagged release v${version}`));
} catch (error) {
  console.log(chalk.red(`❌ Failed to tag release v${version}`));
  console.log(error);
  process.exit(1);
}
