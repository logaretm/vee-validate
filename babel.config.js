module.exports = {
  presets: [
    ['@babel/preset-env', { 'modules': false }]
  ],
  plugins: [
    '@babel/plugin-transform-flow-strip-types'
  ],
  env: {
    test: {
      presets: [
        '@babel/preset-env'
      ],
      plugins: [
        '@babel/plugin-transform-runtime'
      ]
    }
  }
};
