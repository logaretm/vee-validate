/* eslint-disable @typescript-eslint/no-var-requires */

const path = require('path');
const fs = require('fs');

fs.copyFileSync(path.join(__dirname, '../_redirects'), path.join(__dirname, '../dist/_redirects'));
