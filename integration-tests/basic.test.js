const { dremux } = require('../src/index');
const path = require('path');

test('basic integration test', () => {
  dremux({
    artifactsDir: path.resolve(__dirname, 'fixtures/basic/artifacts'),
    resolversDir: path.resolve(__dirname, 'fixtures/basic/resolvers'),
    outputDir: path.resolve(__dirname, 'out/')
  });

});