/**
 * This module provides currency related definitions.
 *
 * @module
 */

import { Just, Maybe, Nothing } from '@telostat/prelude';

/**
 * Type definition for currency code values.
 *
 * A currency code is (typically) defined as all-uppercase, three-letter
 * `string`. In this library, we are particularly using the regular expression
 * {@link REGEXP_CURRENCY_CODE} which allows any uppercase letter followed by
 * uppercase or lowercase letters.
 *
 * As for the type definition: We are using a (not-so-elegant) trick called
 * "tagged-type" to annotate the plain-vanilla `string` type to be the
 * `CurrencyCode` (_poor man's newtype_). Note that during the runtime, all
 * `CurrencyCode` values are simply a `string` values.
 */
export type CurrencyCode = string & { readonly __tag: unique symbol };

/**
 * Regular expression for currency codes in our concept.
 */
export const REGEXP_CURRENCY_CODE = /^[A-Z][a-zA-Z]*$/;

/**
 * Attempts to create a {@link CurrencyCode} value with the given currency code.
 *
 * This function returns a `Maybe` value. For the
 * version that throws an error, see {@link mkCurrencyCodeError}.
 *
 * @param x A currency code represented as string.
 * @returns If the argument has leading or trailing spaces OR it is empty,
 * `Nothing` is retured, `Just` {@link CurrencyCode} otherwise.
 */
export function mkCurrencyCode(x: string): Maybe<CurrencyCode> {
  return REGEXP_CURRENCY_CODE.test(x) ? Just(x as CurrencyCode) : Nothing;
}

/**
 * (Unsafely) attempts to create a {@link CurrencyCode} value with the given
 * currency code.
 *
 * This function may throw an error if the given argument is not a valid
 * currency code. For the monadic version, see {@link mkCurrencyCode}.
 *
 * @param x A currency code represented as string.
 * @returns If the argument has leading or trailing spaces OR it is empty, an
 * error is thrown, {@link CurrencyCode} is returned otherwise.
 */
export function mkCurrencyCodeError(x: string): CurrencyCode {
  return mkCurrencyCode(x).orDefaultLazy(() => {
    throw new Error(`Invalid currency code: ${x}`);
  });
}

/**
 * Return the currency code as a string value.
 *
 * In runtime, this is effectively the identity function.
 *
 * @param x {@link CurrencyCode} to be extracted string from.
 * @returns Currency code as a string.
 */
export function unCurrencyCode(x: CurrencyCode): string {
  return x as string;
}
