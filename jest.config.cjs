module.exports = {
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/apps/web/src'],
  testMatch: ['**/*.test.tsx'],
  transform: { '^.+\\.[tj]sx?$': 'babel-jest' },
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  clearMocks: true,
};
