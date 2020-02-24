const shell = require('shelljs');
const path = require('path');
const { paths } = require('./config');

if (!shell.which('tsc')) {
  shell.echo('Sorry, this script requires typescript\n');
  shell.exit(1);
}

shell.echo('Removing old declarations...');
shell.rm('-rf', path.join(paths.dist, 'types/*'));
shell.echo('Done\n');

shell.echo('Generating main declarations...');
if (shell.exec('tsc --emitDeclarationOnly').code !== 0) {
  shell.echo('Error: Typescript Failed');
  shell.exit(1);
}
shell.echo('Done\n');

shell.echo('Cleaning up declaration folder...');
shell.mv(path.join(paths.dist, 'types/src/*'), path.join(paths.dist, 'types'));
shell.rm('-rf', path.join(paths.dist, 'types/src'));
shell.echo('Done\n');

shell.echo('Copying rule declarations...');
shell.cp(path.join(paths.dist, 'types/rules/index.d.ts'), path.join(paths.dist, 'rules.d.ts'));
if (shell.exec('node ./scripts/replaceDefs.js').code !== 0) {
  shell.echo('Error: ReplaceDefs Failed');
  shell.exit(1);
}
shell.echo('Done\n');
