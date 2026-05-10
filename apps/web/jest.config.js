const sharedConfig = require('@repo/jest-config/next.js');

/** @type {import('jest').Config} */
module.exports = {
  ...sharedConfig,
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};
