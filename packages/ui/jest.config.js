/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  snapshotSerializers: ['@emotion/jest/serializer'],
  setupFilesAfterEnv: ['<rootDir>/jest-setup.ts'],
}
