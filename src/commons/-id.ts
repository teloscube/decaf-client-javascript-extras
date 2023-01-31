/**
 * This module provides a collection of DECAF record identifier type
 * definitions. It is not exhaustive and it will be improved on an ongoing
 * basis.
 *
 * Typically, a DECAF record identifier is either number or string. Some DECAF
 * API endoints can consume string values even though a number is expected. We
 * are sticking here to the original type: No `number | string` definitions.
 *
 * Methodologically, we are using a type trick to emulate newtypes in this
 * module: For example, DECAF artifact identifier type is defined as:
 *
 * ```ts
 * export type DecafArtifactId = number & { readonly __tag: unique symbol };
 * ```
 *
 * In runtime, there is only a number. The `& { readonly __tag: unique symbol }`
 * is provided to the compiler to distinguish in between `number` identifier
 * values  which are representing different DECAF record types.
 *
 * The construction and deconstruction of DECAF record identifiers are done via,
 * respecively, `mkDecafRecordId` and `unDecafRecordId`:
 *
 * ```ts
 * const exampleDecafArtifactIdValue: number = unDecafRecordId(exampleDecafArtifactId);
 * const exampleDecafArtifactId: DecafArtifactId = mkDecafRecordId(42);
 * expect(exampleDecafArtifactIdValue).toBe(42);
 *
 * const exampleDecafActionId: DecafActionId = mkDecafRecordId(42);
 * const exampleDecafActionIdValue: number = unDecafRecordId(exampleDecafActionId);
 * expect(exampleDecafActionIdValue).toBe(42);
 *
 * const exampleDecafArtifactTypeId: DecafArtifactTypeId = mkDecafRecordId('CCY');
 * const exampleDecafArtifactTypeIdValue: string = unDecafRecordId(exampleDecafArtifactTypeId);
 * expect(exampleDecafArtifactTypeIdValue).toBe('CCY');
 * ```
 *
 * To re-iterate, the runtime representation is not affected by how DECAF record
 * identifier types are defined:
 *
 * ```ts
 * interface DecafArtifact {
 *   id: DecafArtifactId;
 *   type: DecafArtifactTypeId;
 * }
 *
 * const exampleDecafArtifact: DecafArtifact = { id: mkDecafRecordId(10), type: mkDecafRecordId('CCY') };
 * expect(exampleDecafArtifact).toStrictEqual({ id: 10, type: 'CCY' });
 * ```
 *
 * @module
 */

/**
 * Type definition covering all possible DECAF record identifiers based on
 * `number` values.
 *
 * This type definition must be extended whenever there is a new DECAF record
 * identifier is defined in this module.
 */
export type _DecafRecordIdFromNumber = DecafArtifactId | DecafActionId;

/**
 * Type definition covering all possible DECAF record identifiers based on
 * `string` values.
 *
 * This type definition must be extended whenever there is a new DECAF record
 * identifier is defined in this module.
 */
export type _DecafRecordIdFromString = DecafArtifactTypeId;

/* Signature for overloaded `mkDecafRecordId` function consuming a `number`. */
export function mkDecafRecordId<T extends _DecafRecordIdFromNumber>(x: number): T;

/* Signature for overloaded `mkDecafRecordId` function consuming a `string`. */
export function mkDecafRecordId<T extends _DecafRecordIdFromString>(x: string): T;

/**
 * Constructor for DECAF record identifiers.
 *
 * @param x Value to create DECAF record identifier from.
 * @returns DECAF record identifier of type deduced from call-site usage.
 */
export function mkDecafRecordId<T>(x: any): T {
  return x as T;
}

/* Signature for overloaded `unDecafRecordId` function producing a `number`. */
export function unDecafRecordId<T extends _DecafRecordIdFromNumber>(x: T): number;

/* Signature for overloaded `unDecafRecordId` function producing a `string`. */
export function unDecafRecordId<K extends _DecafRecordIdFromString>(x: K): string;

/**
 * Deconstructor for DECAF record identifiers.
 *
 * @param x DECAF record identifier.
 * @returns Value of the DECAF record identifier (deduced from call-site usage).
 */
export function unDecafRecordId<T>(x: T): any {
  return x as unknown;
}

/**
 * Type definition for DECAF artifact identifiers.
 */
export type DecafArtifactId = number & { readonly __tag: unique symbol };

/**
 * Type definition for DECAF artifact type identifiers.
 */
export type DecafArtifactTypeId = string & { readonly __tag: unique symbol };

/**
 * Type definition for DECAF share class identifiers.
 */
export type DecafShareClassId = number & { readonly __tag: unique symbol };

/**
 * Type definition for DECAF principal identifiers.
 */
export type DecafPrincipalId = number & { readonly __tag: unique symbol };

/**
 * Type definition for DECAF institution identifiers.
 */
export type DecafInstitutionId = number & { readonly __tag: unique symbol };

/**
 * Type definition for DECAF team identifiers.
 */
export type DecafTeamId = number & { readonly __tag: unique symbol };

/**
 * Type definition for DECAF portfolio identifiers.
 */
export type DecafPortfolioId = number & { readonly __tag: unique symbol };

/**
 * Type definition for DECAF portfolio group identifiers.
 */
export type DecafPortfolioGroupId = number & { readonly __tag: unique symbol };

/**
 * Type definition for DECAF account identifiers.
 */
export type DecafAccountId = number & { readonly __tag: unique symbol };

/**
 * Type definition for DECAF OHLC series identifiers.
 */
export type DecafOhlcSeriesId = number & { readonly __tag: unique symbol };

/**
 * Type definition for DECAF share class fee schedule identifiers.
 */
export type DecafShareClassFeeScheduleId = number & { readonly __tag: unique symbol };

/**
 * Type definition for DECAF action identifiers.
 */
export type DecafActionId = number & { readonly __tag: unique symbol };

/**
 * Type definition for DECAF external valuation identifiers.
 */
export type DecafExternalValuationId = number & { readonly __tag: unique symbol };
