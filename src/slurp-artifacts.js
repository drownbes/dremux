const fs = require('fs');
const path = require('path');
const { debuglog } = require('util');
const fscache = require('./cache');
const { parse } = require('./parser')
const { Graph } = require('./graph');
const { simpleCycles } = require('./cycles');
const { pipe } = require('./fp');


const log = debuglog('artifacts');

function listDir(dir) {
  fs.accessSync(dir);

  const res = new Map();
  const queue = [dir];

  while(queue.length > 0) {
    const entity = queue.shift();
    const stats = fscache.statSync(entity);

    res.set(entity, stats);

    if(stats.isDirectory()) {
      fs.readdirSync(entity)
      .map(e => path.join(entity, e))
      .forEach(e => {
        queue.push(e)
      });
    }
  }

  res.delete(dir);
  return res;
}

function structureList(entityMap) {
  const res = new Map();
  for(let [pwd, stats] of entityMap.entries()) {
    let filesInside = [];
    if(stats.isDirectory()) {
      for(let [file, fileStats] of entityMap.entries()) {
        if(!fileStats.isDirectory() && file.startsWith(pwd)) {
          filesInside.push(file);
        }
      }
    }
    res.set(pwd, {
        stats,
        filesInside
    });
  }
  return res;
}


const parseEntities = (parser, baseDir) => entities => {
  const res = new Map();
  for(let [pwd, data] of entities.entries()) {
    if(!data.stats.isDirectory()) {
      const content = fscache.readFileSync(pwd, 'utf-8');
      const matches = parser(content);
      const depsSet = new Set();
      let isMuxed = false;
      matches.forEach(m => {
        const absPwd = path.resolve(baseDir, m.match);
        m.absPath = absPwd;
        if(!entities.has(absPwd)) {
          throw new Error(`non existent dep: ${absPwd} in file: ${pwd} `);
        }
        if(entities.get(absPwd).stats.isDirectory()) {
          entities.get(absPwd).filesInside.forEach(fin => depsSet.add(fin));
          isMuxed = true;
        } else {
          depsSet.add(absPwd);
        }
      });
      res.set(pwd, {
        ...data,
        matches,
        depsSet,
        isMuxed
      })
    }
  }
  return res;
}

function checkForCycles(entities) {
  const encodeMap = new Map();
  const decodeMap = new Map();
  let index = 0;
  for(let pwd of entities.keys()) {
    decodeMap.set(index, pwd);
    encodeMap.set(pwd, index);
    index++;
  }

  const g = new Graph();
  for(let [pwd, data] of entities.entries()) {
    g.addVertex(encodeMap.get(pwd));
    data.depsSet.forEach(d => {
      g.addEdge(encodeMap.get(pwd), encodeMap.get(d));
    });
  }
  const cycles = simpleCycles(g);
  return cycles.map(cycle => cycle.map(c => decodeMap.get(c)));
}


function slurpArtifacts(dir) {

  const entities = pipe(
    listDir,
    structureList,
    parseEntities(parse(), dir)
  )(dir);

  const cycles = checkForCycles(entities);
  if(cycles.length !== 0) {
    console.error(cycles);
    throw new Error(`have circular dependency`);
  }

  return entities;
}

module.exports = {
  slurpArtifacts
};