import path from 'path';
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
};
