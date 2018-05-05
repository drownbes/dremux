const fs = require('fs');
const path = require('path');

const { slurpResolvers } = require('./slurp-resolvers');
const { slurpArtifacts } = require('./slurp-artifacts');
const { resolve } = require('./resolve');
const { prepareDirs } = require('./output');

async function dremux(params) {
  fs.accessSync(params.artifactsDir);
  fs.accessSync(params.resolversDir);

  const resolvers = slurpResolvers(params.resolversDir);
  const artifacts = slurpArtifacts(params.artifactsDir);

  const writers = prepareDirs(params.outputDir, params.artifactsDir, artifacts);

  await resolve(artifacts, resolvers, writers);

  console.log(`your assets are ready, check ${params.outputDir}`);

}

module.exports = {
  dremux
};


/* cli:

  dremux


*/