module.exports = async function(pwd, depsMap, meta) {
  const dGroups = meta.groupDepsMap(depsMap);
  const content = meta.fscache.readFileSync(pwd);

  const repHash = Object.keys(dGroups).reduce((acc, group) => {
    if(acc.length === 0) {
      dGroups[group].forEach(asset => {
        acc.push({
          [group]: depsMap.get(asset)
        });
      });
      return acc;
    } else {
      const nAcc = [];
      dGroups[group].forEach(asset => {
        acc.forEach(ec => {
          nAcc.push({...ec, [group]: depsMap.get(asset)});
        });
      });
      return nAcc;
    }
  },[]);

  let nameIndex = 0;
  repHash.forEach(rh => {
    const str = meta.replace(rh)(meta.matches)(content);
    meta.write(nameIndex + '.json', str);
    nameIndex++;
  });

  return meta.fscache.readFileSync(pwd);
};