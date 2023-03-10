import fs from 'fs-extra';
import { filesize } from 'filesize';
import { gzipSizeSync } from 'gzip-size';

function reportSize({ path, code }) {
  const { size } = fs.statSync(path);
  const gzipped = gzipSizeSync(code);

  return `| Size: ${filesize(size)} | Gzip: ${filesize(gzipped)}`;
}

export { reportSize };
