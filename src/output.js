const path = require('path');
const fs = require('fs');

const writer = (dir) => (filename, data) => {
  return fs.writeFileSync(path.join(dir, filename), data);
};

function prepareDirs(outDir, artifactsDir, artifacts) {
  const writeMap = new Map();
  const dirsSet = new Set();
  for(let pwd of artifacts.keys()) {
    const artDir = path.parse(pwd);
    const dirToCreate = artDir.dir.replace(artifactsDir, '');
    dirsSet.add(dirToCreate);
    if(artifacts.get(pwd).isMuxed) {
      let muxedDir = path.join(dirToCreate, artDir.name);
      dirsSet.add(muxedDir);
      writeMap.set(pwd, writer(path.join(outDir, muxedDir)));
    } else {
      writeMap.set(pwd, writer(path.join(outDir, dirToCreate)));
    }
  }

  for(let dir of dirsSet.values()) {
    let nl = dir.split(path.sep);
    let d = outDir;
    while(nl.length) {
      d = path.join(d, nl.shift());
      try {
        fs.mkdirSync(d);
      } catch(e) {}
    }
  }

  return writeMap;
}

module.exports = {
  prepareDirs
};