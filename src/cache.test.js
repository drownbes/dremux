jest.mock('fs');

const cache = require('./cache');
const fs = require('fs');
test('fs cache', () => {
  fs.mkdirpSync('/example/booking/');
  fs.writeFileSync('/example/booking/BS713.json', '{}', 'utf-8');
  cache.readFileSync('/example/booking/BS713.json');
  cache.readFileSync('/example/booking/BS713.json');
});