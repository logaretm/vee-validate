import path from 'path';
import fs from 'fs';
import filesize from 'filesize';
import gzipSize from 'gzip-size';
import { version } from '../package.json';

export default {
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
