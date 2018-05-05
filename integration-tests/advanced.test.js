const { dremux } = require('../src/index');
const path = require('path');

test('basic integration test', () => {
  dremux({
    artifactsDir: path.resolve(__dirname, 'fixtures/advanced/artifacts'),
    resolversDir: path.resolve(__dirname, 'fixtures/advanced/resolvers'),
    outputDir: path.resolve(__dirname, 'out/advanced')
  });

});