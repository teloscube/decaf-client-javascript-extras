/**
 * This module provides currency related definitions.
 *
 * @module
 */

import { Just, Maybe, mkPhantom, NewTypeWithPhantom, Nothing, unPhantom } from '@telostat/prelude';

/**
 * Type encoding for currency code values.
 *
 * A currency code is (typically) defined as all-uppercase, three letters.
 */
export type CurrencyCode = NewTypeWithPhantom<'CurrencyCode', string>;

/**
 * Attempts to create a [[CurrencyCode]] value with the given currency code.
 *
 * This function returns a `Maybe` value. For the version that throws an
 * error, see [[mkCurrencyCodeError]].
 *
 * @param x A currency code represented as string.
 * @returns If the argument has leading or trailing spaces OR it is empty,
 * `Nothing` is retured, `Just` [[CurrencyCode]] otherwise.
 */
export function mkCurrencyCode(x: string): Maybe<CurrencyCode> {
  return x !== x.trim() || x === '' ? Nothing : Just(mkPhantom(x));
}

/**
 * (Unsafely) attempts to create a [[CurrencyCode]] value with the given
 * currency code.
 *
 * This function may throw an error if the given argument is not a valid
 * currency code. For the monadic version, see [[mkCurrencyCode]].
 *
 * @param x A currency code represented as string.
 * @returns If the argument has leading or trailing spaces OR it is empty, an
 * error is thrown, [[CurrencyCode]] is returned otherwise.
 */
export function mkCurrencyCodeError(x: string): CurrencyCode {
  return mkCurrencyCode(x).orDefaultLazy(() => {
    throw new Error(`Invalid currency code: "${x}"`);
  });
}

/**
 * Return the currency code as a string value.
 *
 * @param x [[CurrencyCode]] to be extracted string from.
 * @returns Currency code as a string.
 */
export function unCurrencyCode(x: CurrencyCode): string {
  return unPhantom(x);
}
