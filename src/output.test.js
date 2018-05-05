jest.mock('fs');

const { prepareDirs } = require('./output');
const util = require('util');
const fs = require('fs');

test('output dirs', () => {
  const arts = new Map([
    ['/Users/artemmarkov/Projects/dremux/integration-tests/fixtures/basic/artifacts/flight/JK710.flight.json', {isMuxed: true}],
    ['/Users/artemmarkov/Projects/dremux/integration-tests/fixtures/basic/artifacts/booking/BS713.booking.json', {isMuxed: true}]
  ]);

  fs.mkdirpSync('/Users/artemmarkov/Projects/dremux/out/');
  const writersMap = prepareDirs('/Users/artemmarkov/Projects/dremux/out/', '/Users/artemmarkov/Projects/dremux/integration-tests/fixtures/basic/artifacts/', arts);


  expect(fs.statSync('/Users/artemmarkov/Projects/dremux/out/flight/').isDirectory()).toBeTruthy();
  expect(fs.statSync('/Users/artemmarkov/Projects/dremux/out/flight/JK710.flight').isDirectory()).toBeTruthy();
  expect(fs.statSync('/Users/artemmarkov/Projects/dremux/out/booking/').isDirectory()).toBeTruthy();
  expect(fs.statSync('/Users/artemmarkov/Projects/dremux/out/booking/BS713.booking').isDirectory()).toBeTruthy();

  writersMap.get('/Users/artemmarkov/Projects/dremux/integration-tests/fixtures/basic/artifacts/flight/JK710.flight.json')('readyflight.json', 'I am ready flight');
  

});