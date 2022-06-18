// Config for unit tests
module.exports = {
  clearMocks: false,
  collectCoverage: true,
  coverageDirectory: 'jest/coverage',
  coverageProvider: 'v8',
  passWithNoTests: true,
  testEnvironment: 'node',
  testMatch: ['**/*.spec.ts'],
};
