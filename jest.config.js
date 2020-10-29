module.exports = {
  preset: 'ts-jest',
  rootDir: __dirname,
  testMatch: ['<rootDir>/packages/**/tests/**/*spec.[jt]s?(x)'],
  testPathIgnorePatterns: ['/helpers/', '/setup.ts'],
  collectCoverageFrom: ['packages/*/src/**/*.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
  moduleNameMapper: {
    '^@/(.+)$': '<rootDir>/packages/$1/src',
  },
};
