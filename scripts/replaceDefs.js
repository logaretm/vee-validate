const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '../dist/rules.d.ts');
const output = fs.readFileSync(file).toString();

const newOut = output.replace(/from '\.\//g, "from './types/rules/");

fs.writeFileSync(file, newOut);
