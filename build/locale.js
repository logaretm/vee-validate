const path = require('path');
const rollup = require('rollup');
const buble = require('rollup-plugin-buble');
const fs = require('fs');
var UglifyJS = require('uglify-js');
const localesDir = path.join(__dirname, '../locale');

const files = fs.readdirSync(localesDir);
let cache;

files.forEach(file => {
  const entry  = path.join(__dirname, '../locale', file);
  const output = path.join(__dirname, '../dist/locale', file);
  rollup.rollup({
    entry,
    plugins: [
      buble()
    ],
    cache,
  }).then(bundle => {
    bundle.write({
      format: 'umd',
      format: 'umd',
      external: ['VeeValidate'],
      moduleName: '__locale__' + file,
      dest: output
    }).then(() => {
      const result = UglifyJS.minify(output, {
        	mangle: true,
          compress: true
      });
      fs.writeFile(output, result.code, () => {});
    });
  });
});
