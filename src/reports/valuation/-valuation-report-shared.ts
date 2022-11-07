import { Decimal, Maybe, SDate, SDateTime } from '@telostat/prelude';
import { AccountId, ArtifactId, ArtifactTypeId, CurrencyCode, DateType, PortfolioId } from '../../commons';

/**
 * Type definition for base valuation report.
 */
export interface BaseValuationReport {
  asof: SDateTime;
  date: SDate;
  dateType: DateType;
  currency: CurrencyCode;
  accounts: ValuationReportAccounts;
  holdings: ValuationReportHolding[];
  accruals: ValuationReportAccrual[];
  fxRates: ValuationReportFxRate[];
  figures: {
    investment: Decimal;
    valuation: {
      net: Decimal;
      abs: Decimal;
    };
    accrued: Decimal;
    liabilities: Decimal;
    gav: Decimal;
    nav: Decimal;
    aum: Decimal;
    pnl: Decimal;
    pnlToInvestment?: Maybe<Decimal>;
  };
}

/**
 * Type definition for account reference in valuation reports.
 */
export interface ValuationReportAccount {
  id: AccountId;
  guid: string;
  name: string;
}

/**
 * Type definition for portfolio reference in valuation reports.
 */
export interface ValuationReportPortfolio {
  id: PortfolioId;
  guid: string;
  name: string;
}

/**
 * Type definition for accounts which valuation report is compiled from.
 */
export interface ValuationReportAccounts {
  custody: ValuationReportAccount[];
  journal: ValuationReportAccount[];
}

/**
 * The definition for valuation report holding classification.
 */
export type ValuationReportHoldingClassification = ValuationReportHoldingClassificationNode[];

/**
 * Type definition for valuation report holding classification node.
 */
export interface ValuationReportHoldingClassificationNode {
  name: string;
  order: string | number;
}

/**
 * Type definition for base valuation report holding (shared by
 * {@link ValuationReportHolding} and {@link ValuationReportChildHolding}).
 */
export interface BaseValuationReportHolding {
  artifact: ValuationReportArtifact;
  quantity: Decimal;
  investment: ValuationReportHoldingFiguresInvestment;
  valuation: ValuationReportHoldingFiguresValuation;
  valuePercentage: Maybe<Decimal>;
  netExposurePercentage: Maybe<Decimal>;
  absExposurePercentage: Maybe<Decimal>;
  change: Maybe<Decimal>;
  pnl: Decimal;
  pnlToInvestment: Maybe<Decimal>;
  opendate: SDate;
  lastdate: SDate;
}

/**
 * Type definition for valuation report holding investment figures.
 */
export interface ValuationReportHoldingFiguresInvestment {
  px: ValuationReportFigureOrgRef;
  txncosts: Maybe<ValuationReportFigureOrgRef>;
  accrued: Maybe<ValuationReportFigureOrgRef>;
  value: ValuationReportFigureOrgRef;
}

/**
 * Type definition for valuation report holding valuation figures.
 */
export interface ValuationReportHoldingFiguresValuation {
  px: ValuationReportFigureOrgRef;
  accrued: Maybe<ValuationReportFigureOrgRef>;
  value: {
    net: ValuationReportFigureOrgRef;
    abs: ValuationReportFigureOrgRef;
  };
  exposure: {
    net: ValuationReportFigureOrgRef;
    abs: ValuationReportFigureOrgRef;
  };
}

/**
 * Type definition for valuation report figure value that is reported both in
 * original currency and reference currency.
 */
export interface ValuationReportFigureOrgRef {
  org: Decimal;
  ref: Decimal;
}

/**
 * Type definition for a valuation holding.
 */
export interface ValuationReportHolding extends BaseValuationReportHolding {
  classification: ValuationReportHoldingClassification;
  accounts: ValuationReportAccount[];
  children: Maybe<ValuationReportChildHolding[]>;
}

/**
 * Type definition for a valuation holding child.
 */
export interface ValuationReportChildHolding extends BaseValuationReportHolding {
  account: ValuationReportAccount;
}

export function isValuationHolding(
  x: ValuationReportHolding | ValuationReportChildHolding
): x is ValuationReportHolding {
  return 'accounts' in x;
}

export function isValuationChildHolding(
  x: ValuationReportHolding | ValuationReportChildHolding
): x is ValuationReportChildHolding {
  return 'account' in x;
}

/**
 * Valuation accrual.
 */
export interface ValuationReportAccrual {
  name: string;
  value: Decimal;
  accounts: ValuationReportAccrualByAccount[];
}

/**
 * Valuation accrual by account.
 */
export interface ValuationReportAccrualByAccount {
  account: ValuationReportAccount;
  value: Decimal;
  accruals: ValuationReportAccrualByCurrency[];
}

/**
 * Valuation accrual by account by currency.
 */
export interface ValuationReportAccrualByCurrency {
  artifact: ValuationReportArtifact;
  ccy: CurrencyCode;
  value: ValuationReportFigureOrgRef;
}

/**
 * Type definition of the FINREA artifact type.
 */
export interface ValuationReportArtifactType {
  id: ArtifactTypeId;
  name: string;
  order: number;
}

/**
 * Type definition for the artifact as reported in the valuation.
 */
export interface ValuationReportArtifact {
  id: ArtifactId;
  guid: string;
  type: ValuationReportArtifactType;
  stype: Maybe<string>;
  symbol: string;
  name: Maybe<string>;
  ccy: Maybe<CurrencyCode>;
  quantity: Decimal;
  country: Maybe<string>;
  issuer: Maybe<string>;
  sector: Maybe<string>;
  mic: Maybe<string>;
  ticker: Maybe<string>;
  isin: Maybe<string>;
  figi: Maybe<string>;
  expiry: Maybe<SDate>;
  underlyingId: Maybe<ArtifactId>;
}

export interface ValuationReportFxRate {
  ccy1: CurrencyCode;
  ccy2: CurrencyCode;
  value: Decimal;
  asof: SDate;
}
