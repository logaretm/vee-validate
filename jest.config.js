module.exports = {
  setupTestFrameworkScriptFile: '<rootDir>/tests/setup.js',
  testMatch: [
    '**/tests/**/*.js'
  ],
  testPathIgnorePatterns: [
    '/helpers/',
    '/setup.js'
  ],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/index.*.js',
    '!src/install.js',
    '!src/use.js',
    '!src/messages.js',
    '!src/plugins/date/messages.js'
  ],
  moduleFileExtensions: [
    'js',
    'json',
    'vue'
  ],
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
    '.*\\.(vue)$': '<rootDir>/node_modules/vue-jest'
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  }
};
