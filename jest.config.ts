/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */

export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testTimeout: 30000, //от этой ошибки! -> thrown: "Exceeded timeout of 5000 ms for a test.
  testRegex: '.test.ts$', //<-- чтобы запускались только файлы с расширением ".e2e.test.ts"
};
