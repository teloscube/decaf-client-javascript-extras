import { Just, Nothing } from '@telostat/prelude';
import { CurrencyCode, mkCurrencyCode, mkCurrencyCodeError, unCurrencyCode } from './-currency';

describe('currency code tests', () => {
  const inputInvalid = ['', ' ', '\n', '\r', '\t', ' \n\r\t ', ' USD', 'USD ', ' USD ', 'U SD'];
  const inputValid = ['U', 'US', 'USD', 'USd'];

  test('invalid strings are rejected by the smart constructor', () => {
    inputInvalid.forEach((x) => expect(mkCurrencyCode(x)).toBe(Nothing));
  });

  test('invalid strings throw errors by the unsafe constructor', () => {
    inputInvalid.forEach((x) => expect(() => mkCurrencyCodeError(x)).toThrow(/^Invalid currency code: /));
  });

  test('valid strings are accepted by the smart constructor', () => {
    inputValid.forEach((x) => expect(mkCurrencyCode(x)).toStrictEqual(Just(x as CurrencyCode)));
  });

  test('valid strings are accepted by the unsafe constructor', () => {
    inputValid.forEach((x) => expect(mkCurrencyCodeError(x)).toStrictEqual(x as CurrencyCode));
  });

  test('currency codes can be converted back to string', () => {
    inputValid.forEach((x) => expect(unCurrencyCode(mkCurrencyCodeError(x))).toStrictEqual(x));
  });
});
