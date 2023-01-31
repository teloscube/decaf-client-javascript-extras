# Changelog

## [0.1.0](https://github.com/teloscube/decaf-client-javascript-extras/compare/v0.0.5...v0.1.0) (2023-01-31)


### ⚠ BREAKING CHANGES

* The underlying types of DECAF record identifiers have been changed to a simpler, tagged type definitions. Call-sites should use `mkDecafRecordId` constructor and `unDecafRecordId` de-constructor OR direct type casting when producing and consuming such values.
* We are now adopting the convention that constants are defined via all-uppercase, snake-case symbols.
* The underlying type of CurrencyCode has been changed to a simpler, tagged type definition. Call-sites should use either of:

### Code Refactoring

* change type of CurrencyCode, use regexp for validation ([b4915aa](https://github.com/teloscube/decaf-client-javascript-extras/commit/b4915aace037ce9e56be9161ea730529a7d31536))
* change type of DECAF record identifiers ([a2f48c0](https://github.com/teloscube/decaf-client-javascript-extras/commit/a2f48c00525714ffa20ecdca2900b842581ede43))
* rename constant dateTypes to DATE_TYPES ([7801283](https://github.com/teloscube/decaf-client-javascript-extras/commit/7801283bdc72463bbb243f03c5bb10ef77c5dd7a))

## [0.0.5](https://github.com/teloscube/decaf-client-javascript-extras/compare/v0.0.4...v0.0.5) (2022-12-28)


### Bug Fixes

* exclude cash holdings from total exposure calculation ([09d7133](https://github.com/teloscube/decaf-client-javascript-extras/commit/09d7133515d9670dc3c5a641dd84d1e57fa5d5ee))

## [0.0.4](https://github.com/teloscube/decaf-client-javascript-extras/compare/v0.0.3...v0.0.4) (2022-11-07)


### Miscellaneous Chores

* release 0.0.4 ([b3f7a12](https://github.com/teloscube/decaf-client-javascript-extras/commit/b3f7a12b5dbd1ffac7db06f03958d71581889d92))

## [0.0.3](https://github.com/teloscube/decaf-client-javascript-extras/compare/v0.0.2...v0.0.3) (2022-08-25)


### Bug Fixes

* pxRefCcy and pxClsCcy types are wrong in share class values ([1862e1a](https://github.com/teloscube/decaf-client-javascript-extras/commit/1862e1abde3d6e5f8a539233e1408557e9465b07)), closes [#16](https://github.com/teloscube/decaf-client-javascript-extras/issues/16)

## [0.0.2](https://github.com/teloscube/decaf-client-javascript-extras/compare/v0.0.1...v0.0.2) (2022-08-19)


### Bug Fixes

* correct minimum investment type on portfolio valuation report ([c758823](https://github.com/teloscube/decaf-client-javascript-extras/commit/c758823145ae8d575b160727c1152bbb4a425ab3))

## 0.0.1 (2022-08-15)


### Features

* add reports.valuation module implementation ([81f4ae3](https://github.com/teloscube/decaf-client-javascript-extras/commit/81f4ae345687be58541f8cd12eea3146522d0116))


### Miscellaneous Chores

* release please ([7fe3a5e](https://github.com/teloscube/decaf-client-javascript-extras/commit/7fe3a5e86094785c60fc710ead1310e30640bcd9))
