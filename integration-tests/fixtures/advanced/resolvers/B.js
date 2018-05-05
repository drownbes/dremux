module.exports = async function(pwd, depsMap, meta) {
  const dGroups = meta.groupDepsMap(depsMap);
  const content = meta.fscache.readFileSync(pwd);


  const repHash = Object.keys(dGroups).reduce((acc, group) => {
    dGroups[group].forEach(asset => {
      acc[group] = '[' + dGroups[group].map(asset => depsMap.get(asset)).join(',') + ']';
    })
    return acc;
  },{});

  return meta.replace(repHash)(meta.matches)(content);
};