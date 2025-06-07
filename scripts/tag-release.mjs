import pkg from '../packages/vee-validate/package.json' with { type: 'json' };
import { execSync } from 'node:child_process';
import chalk from 'chalk';

try {
  execSync(`git tag v${pkg.version}`);
  console.log(chalk.green(`🔖 Tagged release v${pkg.version}`));
} catch (error) {
  console.log(chalk.red(`❌ Failed to tag release v${pkg.version}`));
  console.log(error);
  process.exit(1);
}
