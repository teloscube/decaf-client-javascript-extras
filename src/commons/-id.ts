import { NewTypeWithPhantom } from '@telostat/prelude';

/**
 * Type definition for identifiers with value spaces discriminated over the
 * given phantom type.
 */
export type Id<P, V> = NewTypeWithPhantom<P, V>;

/**
 * Type definition for DECAF artifact identifiers.
 */
export type ArtifactId = NewTypeWithPhantom<'DecafArtifact', string | number>;

/**
 * Type definition for DECAF artifact type identifiers.
 */
export type ArtifactTypeId = NewTypeWithPhantom<'DecafArtifactType', string>;

/**
 * Type definition for DECAF share class identifiers.
 */
export type ShareClassId = NewTypeWithPhantom<'DecafShareClass', string | number>;

/**
 * Type definition for DECAF principal identifiers.
 */
export type PrincipalId = NewTypeWithPhantom<'DecafPrincipal', string | number>;

/**
 * Type definition for DECAF institution identifiers.
 */
export type InstitutionId = NewTypeWithPhantom<'DecafInstitution', string | number>;

/**
 * Type definition for DECAF team identifiers.
 */
export type TeamId = NewTypeWithPhantom<'DecafTeam', string | number>;

/**
 * Type definition for DECAF portfolio identifiers.
 */
export type PortfolioId = NewTypeWithPhantom<'DecafPortfolio', string | number>;

/**
 * Type definition for DECAF portfolio group identifiers.
 */
export type PortfolioGroupId = NewTypeWithPhantom<'DecafPortfolioGroup', string | number>;

/**
 * Type definition for DECAF account identifiers.
 */
export type AccountId = NewTypeWithPhantom<'DecafAccount', string | number>;

/**
 * Type definition for DECAF OHLC series identifiers.
 */
export type OhlcSeriesId = NewTypeWithPhantom<'DecafOhlcSeries', string | number>;

/**
 * Type definition for DECAF share class fee schedule identifiers.
 */
export type ShareClassFeeScheduleId = NewTypeWithPhantom<'DecafShareClassFeeSchedule', string | number>;

/**
 * Type definition for DECAF action identifiers.
 */
export type ActionId = NewTypeWithPhantom<'DecafAction', string | number>;

/**
 * Type definition for DECAF external valuation identifiers.
 */
export type ExternalValuationId = NewTypeWithPhantom<'DecafExternalValuation', string | number>;
