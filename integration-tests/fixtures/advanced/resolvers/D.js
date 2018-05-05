module.exports = async function(pwd, depsMap, meta) {
  //console.log(pwd, meta.groupDepsMap(depsMap));
  return meta.fscache.readFileSync(pwd);
};