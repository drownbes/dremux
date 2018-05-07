jest.mock('fs');

const { prepareDirs } = require('./output');
const util = require('util');
const fs = require('fs');

test('output dirs', () => {
  const arts = new Map([
    ['/basic/artifacts/flight/JK710.flight.json', {isMuxed: true}],
    ['/basic/artifacts/booking/BS713.booking.json', {isMuxed: true}]
  ]);

  fs.mkdirpSync('/Projects/dremux/out/');
  const writersMap = prepareDirs('/Projects/dremux/out/', '/basic/artifacts/', arts);


  expect(fs.statSync('/Projects/dremux/out/flight/').isDirectory()).toBeTruthy();
  expect(fs.statSync('/Projects/dremux/out/flight/JK710.flight').isDirectory()).toBeTruthy();
  expect(fs.statSync('/Projects/dremux/out/booking/').isDirectory()).toBeTruthy();
  expect(fs.statSync('/Projects/dremux/out/booking/BS713.booking').isDirectory()).toBeTruthy();

  writersMap.get('/basic/artifacts/flight/JK710.flight.json')('readyflight.json', 'I am ready flight');
  expect(fs.readFileSync('/Projects/dremux/out/flight/JK710.flight/readyflight.json', 'utf-8')).toEqual('I am ready flight');
});