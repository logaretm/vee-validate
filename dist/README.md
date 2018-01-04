## Dist Files

### Types

- **Full**: builds that contains everything vee-validate has to offer.

- **Minimal**: same as the full build but without any built in rules, so you bundle the rules your application is going to use without having to include the others.

### Files

- **vee-validate.js**: Is the full default UMD build.
- **vee-validate.esm.js**: The full default build exported as an ES module.
- **vee-validate.minimal.js**: The minimal UMD build.
- **vee-validate.minimal.esm.js**: The minimal build exported as an ES module.

### Builds

- **[UMD](https://github.com/umdjs/umd)**: UMD builds can be used directly in the browser via a `<script>` tag. The default file from Unpkg CDN at [https://unpkg.com/vee-validate](https://unpkg.com/vee-validate).

- **[ES Module](http://exploringjs.com/es6/ch_modules.html)**: ES module builds are intended for use with modern bundlers like [webpack 2 or 3](https://webpack.js.org) or [rollup](http://rollupjs.org/).
