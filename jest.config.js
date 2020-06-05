module.exports = {
  preset: 'ts-jest',
  rootDir: __dirname,
  setupFilesAfterEnv: ['<rootDir>/packages/core/tests/setup.ts'],
  testMatch: ['<rootDir>/packages/**/tests/**/*spec.[jt]s?(x)'],
  testPathIgnorePatterns: ['/helpers/', '/setup.ts'],
  collectCoverageFrom: ['packages/*/src/**/*.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
  moduleNameMapper: {
    '^@vee-validate/(.+)$': '<rootDir>/packages/$1/src',
  },
};
