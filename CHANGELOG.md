# Changelog

## [0.5.1](https://github.com/teloscube/decaf-client-javascript-extras/compare/v0.5.0...v0.5.1) (2024-08-31)


### Bug Fixes

* make grouping option configurable for holdings tree function ([ae97991](https://github.com/teloscube/decaf-client-javascript-extras/commit/ae97991f23393d04d85f782baedbd635a247db88))

## [0.5.0](https://github.com/teloscube/decaf-client-javascript-extras/compare/v0.4.0...v0.5.0) (2024-08-14)


### ⚠ BREAKING CHANGES

* drop support for Node 16 and add Node 22

### Features

* implement account valuation report ([26cb078](https://github.com/teloscube/decaf-client-javascript-extras/commit/26cb078a3e9a13811366be1f22b25326bdc79fa9))


### Miscellaneous Chores

* drop support for Node 16 and add Node 22 ([e23f398](https://github.com/teloscube/decaf-client-javascript-extras/commit/e23f398d19e1c95630e690ed8323e0561afae787))

## [0.4.0](https://github.com/teloscube/decaf-client-javascript-extras/compare/v0.3.0...v0.4.0) (2024-03-28)


### ⚠ BREAKING CHANGES

* fix various type issues due to DECAF Barista v2 release

### Bug Fixes

* fix various type issues due to DECAF Barista v2 release ([f15d9ac](https://github.com/teloscube/decaf-client-javascript-extras/commit/f15d9ac523b4911abd7fc9705803fd85e0e0acb5))

## [0.3.0](https://github.com/teloscube/decaf-client-javascript-extras/compare/v0.2.0...v0.3.0) (2023-12-05)


### ⚠ BREAKING CHANGES

* drop support for Node 16

### Miscellaneous Chores

* drop support for Node 16 ([4ba8384](https://github.com/teloscube/decaf-client-javascript-extras/commit/4ba8384aabf4f48fc7f9ce6ea85c6326057c749d))

## [0.2.0](https://github.com/teloscube/decaf-client-javascript-extras/compare/v0.1.1...v0.2.0) (2023-05-19)


### ⚠ BREAKING CHANGES

* make minimum supported node version 16

### Miscellaneous Chores

* make minimum supported node version 16 ([ce38994](https://github.com/teloscube/decaf-client-javascript-extras/commit/ce38994cd38868821beb9ad7b2a466c32e8aa50a))

## [0.1.1](https://github.com/teloscube/decaf-client-javascript-extras/compare/v0.1.0...v0.1.1) (2023-04-02)


### Miscellaneous Chores

* release 0.1.1 ([e5aedf7](https://github.com/teloscube/decaf-client-javascript-extras/commit/e5aedf7ac6f802da1afdafbe2e040fb455d28c82))

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
