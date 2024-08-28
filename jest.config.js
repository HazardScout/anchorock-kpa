module.exports = {
    testEnvironment: 'node',
    testMatch: ['**/*.test.ts'],
    transform: {
      '^.+\\.(ts|tsx)?$': 'ts-jest'
    }
};
