module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  coverageDirectory: '<rootDir>/dist/coverage',
  coveragePathIgnorePatterns: ['__tests__'],
  roots: [
    '<rootDir>/src'
  ],
  testMatch: [
    '**/?(*.)+(spec|test).+(ts|tsx|js)'
  ],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest'
  },
};