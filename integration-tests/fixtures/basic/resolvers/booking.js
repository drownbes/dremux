const path = require('path');
module.exports = async function (pwd, depsMap, meta) {

  let gpd = [...depsMap.keys()].reduce((acc, pwd) => {
    const p = path.parse(path.parse(pwd).dir).base;
    console.log(acc);
    if(!acc[p]) {
      acc[p] = [];
    }
    acc[p].push(pwd);
    return acc;
  }, {});
  console.log(gpd);

  const bName = path.parse(pwd).name;
  for(let depPwd of depsMap.keys()) {
    const dName = path.parse(depPwd).name;
    meta.write(`${bName}__${dName}`, depsMap.get(depPwd));
  }
  return `booking resolver ${pwd}`;
}