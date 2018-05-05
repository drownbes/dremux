const path = require('path');
const { replace,replaceAbs } = require('./parser');
const fscache = require('./cache');


function groupDepsMap(depsMap) {
  return [...depsMap.keys()].reduce((acc, pwd) => {
    const p = path.parse(path.parse(pwd).dir).base + '/';
    if(!acc[p]) {
      acc[p] = [];
    }
    acc[p].push(pwd);
    return acc;
  }, {});
}



async function resolveArtifacts(artifacts, pwdResolverMap, writers) {
  const res = new Map();
  while(artifacts.size !== res.size) {
    for(let pwd of artifacts.keys()) {
      if(res.has(pwd)) continue;
      let deps = artifacts.get(pwd).depsSet;
      if(deps.size === 0) {
        res.set(pwd, pwdResolverMap.get(pwd)(pwd, new Map(), {
          write: writers.get(pwd),
          replace,
          replaceAbs,
          fscache,
          matches: artifacts.get(pwd).matches,
          groupDepsMap
        }));
      } else {
        const isAllDepsStarted = [...deps].every(res.has.bind(res));
        if(!isAllDepsStarted) continue;
        const dpp = Promise.all(
          [...deps].map(res.get.bind(res))
        ).then(resolvedDeps => {
          const depsMap = new Map();
          let i = 0;
          deps.forEach((depPwd) => {
            depsMap.set(depPwd, resolvedDeps[i]);
            i++;
          })
          return pwdResolverMap.get(pwd)(pwd, depsMap, {
            write: writers.get(pwd),
            replace,
            replaceAbs,
            fscache,
            matches: artifacts.get(pwd).matches,
            groupDepsMap
          });
        });
        res.set(pwd, dpp);
      }
    }
  }
  return Promise.all([...res.values()]);
}


async function resolve(artifacts, resolvers, writers) {
  const missedResolvers = new Set();
  const pwdResolverMap = new Map();
  [...artifacts.keys()].forEach(pwd => {
    const p = path.basename(pwd);
    const parts = p.split('.');
    const usedResolver = parts[parts.length - 2];
    if(!resolvers.has(usedResolver)) {
      missedResolvers.add(usedResolver);
    } else {
      pwdResolverMap.set(pwd, resolvers.get(usedResolver));
    }
  });

  if(missedResolvers.size !== 0) {
    throw new Error(`missed resolvers: ${[...missedResolvers.keys()]}`);
  }

  return resolveArtifacts(artifacts, pwdResolverMap, writers);
}


module.exports = {
  resolve
};