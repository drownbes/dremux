const fs = require('fs');
const path = require('path');

function slurpResolvers(dir) {
  const res = new Map();
  fs.accessSync(dir);
  fs.readdirSync(dir).forEach(resolver => {
    const pwd = path.join(dir, resolver);
    const r = require(pwd);
    if(typeof r !== 'function') {
      throw new Error(`resolver ${pwd} is not a function`);
    }
    const name = path.basename(pwd, '.js');
    res.set(name, r);
  });
  return res;
}

module.exports = {
  slurpResolvers
};
