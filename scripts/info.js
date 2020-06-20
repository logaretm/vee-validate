const fs = require('fs-extra');
const filesize = require('filesize');
const gzipSize = require('gzip-size');

function reportSize({ path, code }) {
  const { size } = fs.statSync(path);
  const gzipped = gzipSize.sync(code);

  return `| Size: ${filesize(size)} | Gzip: ${filesize(gzipped)}`;
}

module.exports = {
  reportSize,
};
