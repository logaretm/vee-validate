const path = require('path');
const fs = require('fs');
const filesize = require('filesize');
const gzipSize = require('gzip-size');
const { version } = require('../package.json');

module.exports = {
  banner:
  `/**
  * vee-validate v${version}
  * (c) ${new Date().getFullYear()} Abdelrahman Awad
  * @license MIT
  */`,
  outputFolder: path.join(__dirname, '..', 'dist'),
  uglifyOptions: {
    compress: true,
    mangle: true,
  },
  utils: {
    stats ({ path, code }) {
      const { size } = fs.statSync(path);
      const gzipped = gzipSize.sync(code);

      return `| Size: ${filesize(size)} | Gzip: ${filesize(gzipped)}`;
    }
  }
};
