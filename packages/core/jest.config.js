module.exports = {
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  testMatch: ['**/tests/**/*.js', '**/tests/**/*.ts'],
  testPathIgnorePatterns: ['/helpers/', '/setup.js'],
  collectCoverageFrom: ['src/**/*.ts', '!src/index.ts'],
  moduleFileExtensions: ['js', 'ts', 'json', 'vue'],
  transform: {
    '\\.(ts)$': 'ts-jest',
    '^.+\\.jsx?$': 'babel-jest',
    '.*\\.(vue)$': '<rootDir>/node_modules/vue-jest'
  },
  moduleNameMapper: {
    '^vue$': 'vue/dist/vue.common.js',
    '^@i18n/(.*)$': '<rootDir>/../i18n/src/$1',
    '@vee-validate/rules': '<rootDir>/../rules/src/index.ts',
    '@vee-validate/shared': '<rootDir>/../shared/src/index.ts',
    '^@/(.*)$': '<rootDir>/src/$1'
  }
};
