const { parse, replace } = require('./parser');


const tests = [
  `
    "<| somefile/name/1.js |>"
    "<| somefile/name/2.js |>"
    "<| somefile/name/3.js |>"
  `,
  `
    "<| somefile/name/1.js |>" "<| somefile/name/2.js |>"
    "<| somefile/name/3.js |>"
  `,
  `
    "<| somefile/name/1.js |>""<| somefile/name/2.js |>"
    "<| somefile/name/3.js |>"
  `,
  ``,
  `"<|`,
  `|>"`
];

const replaceTestData = `{
  "tourOperator":  "APO",
  "bookingClass": "Y",
  "flights": [
    "<| A3293.flight.json |>",
    "<| A3294.flight.json |>"
  ],
  "passengers": "<| TwoAdults.passenger.json |>",
  "baseUrl": "shop/aegean",
  "shopName": "Aegean Airlines"
}`;

const replaceHash = {
  'A3293.flight.json': '1',
  'A3294.flight.json': '2',
  'TwoAdults.passenger.json': '3'
};

const expected = `{
  "tourOperator":  "APO",
  "bookingClass": "Y",
  "flights": [
    1,
    2
  ],
  "passengers": 3,
  "baseUrl": "shop/aegean",
  "shopName": "Aegean Airlines"
}`;


test('parse', () => {
  const p = parse();
  tests.forEach(test => {
    expect(p(test)).toMatchSnapshot();
  });
});

test('replace', () => {
  const p = parse();
  const matches = p(replaceTestData);

  const r = replace(replaceHash)(matches)(replaceTestData);
  expect(r).toEqual(expected);
});

test('replace throw on mis in replace hash', () => {
  const p = parse();
  const matches = p(replaceTestData);

  expect(() => replace({})(matches)(replaceTestData)).toThrow();
});

test('replace return passed string on empty string or empty matches', () => {
  expect(replace({})([])(replaceTestData)).toEqual(replaceTestData);
  expect(replace({})([])('')).toEqual('');
});