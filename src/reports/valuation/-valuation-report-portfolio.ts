import { Decimal, Maybe, SDate, SDateTime } from '@telostat/prelude';
import {
  ActionId,
  CurrencyCode,
  ExternalValuationId,
  OhlcSeriesId,
  PortfolioId,
  PrincipalId,
  ShareClassFeeScheduleId,
  ShareClassId,
} from '../../commons';
import { BaseValuationReport, ValuationReportPortfolio } from './-valuation-report-shared';

export interface PortfolioValuationReport extends BaseValuationReport {
  portfolio: ValuationReportPortfolio;
  subscriptions: Decimal;
  shareClassValues: PortfolioValuationReportShareClassValue[];
}

export interface PortfolioValuationReportShareClassValue {
  shareclass: PortfolioValuationReportShareClass;
  external: Maybe<PortfolioValuationReportExternalValue>;
  nav: Decimal;
  navAdjusted: Decimal;
  navAdjustedTotal: Decimal;
  coefficient: Decimal;
  gavRefccy: Decimal;
  gavClsccy: Decimal;
  sharecountPrev: Decimal;
  sharecountCurr: Decimal;
  sharecountDiff: Decimal;
  pxRefCcy: Decimal;
  pxClsCcy: Decimal;
  ytdExt: Maybe<Decimal>;
  ytdInt: Maybe<Decimal>;
}

export interface PortfolioValuationReportShareClass {
  id: ShareClassId;
  created: SDateTime;
  creator: Maybe<PrincipalId>;
  updated: SDateTime;
  updater: Maybe<PrincipalId>;
  guid: string;
  portfolio: PortfolioId;
  name: string;
  currency: CurrencyCode;
  isin: Maybe<string>;
  bbgticker: Maybe<string>;
  liquidity: Maybe<string>;
  jurisdiction: Maybe<string>;
  administrator: Maybe<string>;
  minimumInvestment: Maybe<number>;
  subscriptionRedemptionPeriod: Maybe<string>;
  managementFeeFrequency: Maybe<number>;
  performanceFeeFrequency: Maybe<number>;
  benchmark: Maybe<OhlcSeriesId>;
  description: Maybe<string>;
  feeScheduleIds: ShareClassFeeScheduleId[];
  effectiveFeeScheduleId: Maybe<ShareClassFeeScheduleId>;
  subscriptionIds: ActionId[];
  outstanding: Maybe<Decimal>;
}

export interface PortfolioValuationReportExternalValue {
  id: ExternalValuationId;
  created: SDateTime;
  creator: Maybe<PrincipalId>;
  updated: SDateTime;
  updater: Maybe<PrincipalId>;
  guid: string;
  portfolio: PortfolioId;
  shareclass: Maybe<ShareClassId>;
  date: SDate;
  ccy: CurrencyCode;
  shares: Maybe<Decimal>;
  price: Maybe<Decimal>;
  nav: Maybe<Decimal>;
  aum: Maybe<Decimal>;
  hedgepnl: Maybe<Decimal>;
  feemngt: Maybe<Decimal>;
  feeperf: Maybe<Decimal>;
  otheraccrued: Maybe<Decimal>;
  totalaccrued: Maybe<Decimal>;
  subred: Maybe<Decimal>;
  perfdaily: Maybe<Decimal>;
  perfweekly: Maybe<Decimal>;
  perfmonthly: Maybe<Decimal>;
  perfytd: Maybe<Decimal>;
  perfstart: Maybe<Decimal>;
  coefficient: Maybe<Decimal>;
}
