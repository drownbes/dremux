module.exports = async function(pwd, depsMap, meta) {
  const content = meta.fscache.readFileSync(pwd);

  return meta.replaceAbs(depsMap)(meta.matches)(content);
};