module.exports = {
  testMatch: ['**/tests/**/*.js', '**/tests/**/*.ts'],
  testPathIgnorePatterns: ['/helpers.js', '/setup.js'],
  collectCoverageFrom: ['src/**/*.ts', '!src/index.ts'],
  transform: {
    '\\.(ts)$': 'ts-jest',
    '^.+\\.jsx?$': 'babel-jest'
  },
  moduleNameMapper: {
    '^vue$': 'vue/dist/vue.common.js',
    '@vee-validate/shared': '<rootDir>/../shared/src/index.ts',
    '^@/(.*)$': '<rootDir>/src/$1'
  }
};
