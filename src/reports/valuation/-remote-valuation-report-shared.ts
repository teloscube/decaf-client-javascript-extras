import {
  CustomError,
  Decimal,
  decimalFromNullable,
  Either,
  Just,
  Maybe,
  Right,
  safeDiv,
  sanitizedNonEmptyText,
  SDate,
  SDateTime,
  unsafeDecimal,
  zero,
} from '@telostat/prelude';
import { CurrencyCode, DateType, DecafArtifactId, DecafArtifactTypeId } from '../../commons';
import {
  BaseValuationReport,
  BaseValuationReportHolding,
  ValuationReportAccount,
  ValuationReportAccounts,
  ValuationReportAccrual,
  ValuationReportArtifact,
  ValuationReportFigureOrgRef,
  ValuationReportHolding,
} from './-valuation-report-shared';

export interface RemoteBaseValuationReport {
  reported: SDateTime;
  asof: SDate;
  type: DateType;
  ccy: CurrencyCode;
  accounts: ValuationReportAccounts;
  holdings: RemoteValuationReportHolding[];
  accruals: RemoteValuationReportAccrual[];
  investment?: number;
  valuation_net?: number;
  valuation_abs?: number;
  accrued?: number;
  liabilities?: number;
  gav?: number;
  nav?: number;
  aum?: number;
  pnl?: number;
  pnl_to_investment?: number;
  fxrates: RemoteValuationReportFxRate[];
}

export interface RemoteValuationReportFxRate {
  ccy1: CurrencyCode;
  ccy2: CurrencyCode;
  value: number; // TODO: Check when no such rate is defined.
  asof: SDate;
}

/**
 * Valuation holding.
 */
export interface RemoteValuationReportHolding {
  artifact: RemoteValuationReportArtifact;
  tags: { classification: { name: string; order?: string | number }[] };
  quantity: number;
  accounts: ValuationReportAccount[];
  investment: {
    px: { org?: number; ref?: number };
    txncosts: { org?: number; ref?: number };
    accrued: { org?: number; ref?: number };
    value: { org?: number; ref?: number };
  };
  valuation: {
    px: { org?: number; ref?: number };
    accrued: { org?: number; ref?: number };
    value: {
      net: { org?: number; ref?: number };
      abs: { org?: number; ref?: number };
    };
    exposure: {
      net: { org?: number; ref?: number };
      abs: { org?: number; ref?: number };
    };
  };
  children: RemoteValuationReportChildHolding[];
  change?: number;
  pnl?: number;
  pnl_to_investment?: number;
  opendate: SDate;
  lastdate: SDate;
}

/**
 * Valuation child holding.
 */
export interface RemoteValuationReportChildHolding {
  artifact: RemoteValuationReportArtifact;
  tags: {};
  quantity: number;
  accounts: ValuationReportAccount[];
  investment: {
    px: { org?: number; ref?: number };
    txncosts: { org?: number; ref?: number };
    accrued: { org?: number; ref?: number };
    value: { org?: number; ref?: number };
  };
  valuation: {
    px: { org?: number; ref?: number };
    accrued: { org?: number; ref?: number };
    value: {
      net: { org?: number; ref?: number };
      abs: { org?: number; ref?: number };
    };
    exposure: {
      net: { org?: number; ref?: number };
      abs: { org?: number; ref?: number };
    };
  };
  change?: number;
  pnl?: number;
  pnl_to_investment?: number;
  opendate: SDate;
  lastdate: SDate;
}

/**
 * Valuation artifact.
 */
export interface RemoteValuationReportArtifact {
  id: DecafArtifactId;
  guid: string;
  type: { id: DecafArtifactTypeId; name: string; order: number };
  stype?: string;
  symbol: string;
  name?: string;
  ccy?: CurrencyCode;
  quantity: number;
  country?: string;
  issuer?: string;
  sector?: string;
  mic?: string;
  ticker?: string;
  isin?: string;
  figi?: string;
  expiry?: SDate;
  underlying_id?: DecafArtifactId;
}

/**
 * Valuation accrual.
 */
export interface RemoteValuationReportAccrual {
  name: string;
  value: number;
  accounts: RemoteValuationReportAccrualByAccount[];
}

/**
 * Valuation accrual by account.
 */
export interface RemoteValuationReportAccrualByAccount {
  account: ValuationReportAccount;
  value: number;
  accruals: RemoteValuationReportAccrualByCurrency[];
}

/**
 * Valuation accrual by account by currency.
 */
export interface RemoteValuationReportAccrualByCurrency {
  artifact: RemoteValuationReportArtifact;
  ccy: CurrencyCode;
  value: { org?: number; ref?: number };
}

export function toArtifact(x: RemoteValuationReportArtifact): ValuationReportArtifact {
  return {
    id: x.id,
    guid: x.guid,
    type: x.type,
    stype: sanitizedNonEmptyText(x.stype),
    symbol: x.symbol,
    name: sanitizedNonEmptyText(x.name),
    ccy: Maybe.fromNullable(x.ccy),
    quantity: unsafeDecimal(x.quantity),
    country: sanitizedNonEmptyText(x.country),
    issuer: sanitizedNonEmptyText(x.issuer),
    sector: sanitizedNonEmptyText(x.sector),
    mic: sanitizedNonEmptyText(x.mic),
    ticker: sanitizedNonEmptyText(x.ticker),
    isin: sanitizedNonEmptyText(x.isin),
    figi: sanitizedNonEmptyText(x.figi),
    expiry: Maybe.fromNullable(x.expiry),
    underlyingId: Maybe.fromNullable(x.underlying_id),
  };
}

export function toAccrual(x: RemoteValuationReportAccrual): ValuationReportAccrual {
  return {
    name: x.name,
    value: unsafeDecimal(x.value),
    accounts: x.accounts.map((y) => ({
      account: y.account,
      value: unsafeDecimal(y.value),
      accruals: y.accruals.map((z) => ({
        artifact: toArtifact(z.artifact),
        ccy: z.ccy,
        value: {
          org: decimalFromNullable(z.value.org).orDefault(zero),
          ref: decimalFromNullable(z.value.ref).orDefault(zero),
        },
      })),
    })),
  };
}

export function toOrgRef(x: { org?: number; ref?: number }): ValuationReportFigureOrgRef {
  return {
    org: decimalFromNullable(x.org).orDefault(zero),
    ref: decimalFromNullable(x.ref).orDefault(zero),
  };
}

export function toMaybeOrgRef(x?: { org?: number; ref?: number }): Maybe<ValuationReportFigureOrgRef> {
  return Maybe.fromNullable(x).chain(({ org, ref }) =>
    decimalFromNullable(org).chain((o) => decimalFromNullable(ref).chain((r) => Just({ org: o, ref: r })))
  );
}

export function toBaseHolding(
  nav: Decimal,
  x: RemoteValuationReportHolding | RemoteValuationReportChildHolding
): BaseValuationReportHolding {
  return {
    artifact: toArtifact(x.artifact),
    quantity: unsafeDecimal(x.quantity),
    investment: {
      px: toOrgRef(x.investment.px),
      txncosts: toMaybeOrgRef(x.investment.txncosts),
      accrued: toMaybeOrgRef(x.investment.accrued),
      value: toOrgRef(x.investment.value),
    },
    valuation: {
      px: toOrgRef(x.valuation.px),
      accrued: toMaybeOrgRef(x.valuation.accrued),
      value: {
        net: toOrgRef(x.valuation.value.net),
        abs: toOrgRef(x.valuation.value.abs),
      },
      exposure: {
        net: toOrgRef(x.valuation.exposure.net),
        abs: toOrgRef(x.valuation.exposure.abs),
      },
    },
    valuePercentage: safeDiv(decimalFromNullable(x.valuation.value.net.ref).orDefault(zero), nav),
    netExposurePercentage: safeDiv(decimalFromNullable(x.valuation.exposure.net.ref).orDefault(zero), nav),
    absExposurePercentage: safeDiv(decimalFromNullable(x.valuation.exposure.abs.ref).orDefault(zero), nav),
    change: decimalFromNullable(x.change),
    pnl: decimalFromNullable(x.pnl).orDefault(zero),
    pnlToInvestment: decimalFromNullable(x.pnl_to_investment),
    opendate: x.opendate,
    lastdate: x.lastdate,
  };
}

export function toHolding(nav: Decimal, x: RemoteValuationReportHolding): ValuationReportHolding {
  return {
    ...toBaseHolding(nav, x),
    classification: x.tags.classification.map((n) => ({ ...n, order: n.order || '' })),
    accounts: x.accounts,
    children: Maybe.fromNullable(x.children)
      .filter((mc) => mc.length !== 0)
      .map((mc) =>
        mc.map((c) => ({
          ...toBaseHolding(nav, c),
          account: c.accounts[0] as ValuationReportAccount,
        }))
      ),
  };
}

/**
 * Attempts to re-compile the raw, remote base valuation report and
 * return it.
 *
 * @param x Raw, remote base valuation report.
 * @returns Either of an error message or the re-compiled base valuation
 * report.
 */
export function recompileBaseValuationReport(x: RemoteBaseValuationReport): Either<CustomError, BaseValuationReport> {
  const nav = decimalFromNullable(x.nav).orDefault(zero);

  const report: BaseValuationReport = {
    asof: x.reported,
    date: x.asof,
    dateType: x.type,
    currency: x.ccy,
    accounts: x.accounts,
    holdings: x.holdings.map((rh) => toHolding(nav, rh)),
    accruals: x.accruals.map(toAccrual),
    fxRates: x.fxrates.map((r) => ({ ccy1: r.ccy1, ccy2: r.ccy2, value: unsafeDecimal(r.value), asof: r.asof })),
    figures: {
      investment: decimalFromNullable(x.investment).orDefault(zero),
      valuation: {
        net: decimalFromNullable(x.valuation_net).orDefault(zero),
        abs: decimalFromNullable(x.valuation_abs).orDefault(zero),
      },
      accrued: decimalFromNullable(x.accrued).orDefault(zero),
      liabilities: decimalFromNullable(x.liabilities).orDefault(zero),
      gav: decimalFromNullable(x.gav).orDefault(zero),
      nav,
      aum: decimalFromNullable(x.aum).orDefault(zero),
      pnl: decimalFromNullable(x.pnl).orDefault(zero),
      pnlToInvestment: decimalFromNullable(x.pnl_to_investment),
    },
  };

  return Right(report);
}
