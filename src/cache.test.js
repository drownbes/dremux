const cache = require('./cache');

test('fs cache', () => {

  const t = cache.readFileSync('/Users/artemmarkov/Projects/dremux/src/example/booking/BS713.json');
  cache.readFileSync('/Users/artemmarkov/Projects/dremux/src/example/booking/BS713.json');
});