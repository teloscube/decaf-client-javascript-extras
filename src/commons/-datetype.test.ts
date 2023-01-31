import { DATE_TYPES } from './-datetype';

describe('date-type tests', () => {
  test('we maintain the catalogue of date-type tests', () => {
    expect(DATE_TYPES).toStrictEqual([
      { label: 'Trade Date', value: 'commitment' },
      { label: 'Value Date', value: 'settlement' },
    ]);
  });
});
