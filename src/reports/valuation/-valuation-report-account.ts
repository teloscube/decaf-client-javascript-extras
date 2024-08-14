import { Decimal, Maybe, SDate, SDateTime } from '@telostat/prelude';
import {
  DecafActionId,
  CurrencyCode,
  DecafExternalValuationId,
  DecafOhlcSeriesId,
  DecafPortfolioId,
  DecafPrincipalId,
  DecafShareClassFeeScheduleId,
  DecafShareClassId,
} from '../../commons';
import { BaseValuationReport, ValuationReportAccount } from './-valuation-report-shared';

export interface AccountValuationReport extends BaseValuationReport {
  account: ValuationReportAccount;
  subscriptions: Decimal;
  shareClassValues: AccountValuationReportShareClassValue[];
}

export interface AccountValuationReportShareClassValue {
  shareclass: Maybe<AccountValuationReportShareClass>;
  external: Maybe<AccountValuationReportExternalValue>;
  nav: Decimal;
  navAdjusted: Decimal;
  navAdjustedTotal: Decimal;
  coefficient: Decimal;
  gavRefccy: Decimal;
  gavClsccy: Decimal;
  sharecountPrev: Maybe<Decimal>;
  sharecountCurr: Maybe<Decimal>;
  sharecountDiff: Maybe<Decimal>;
  pxRefCcy: Maybe<Decimal>;
  pxClsCcy: Maybe<Decimal>;
  ytdExt: Maybe<Decimal>;
  ytdInt: Maybe<Decimal>;
}

export interface AccountValuationReportShareClass {
  id: DecafShareClassId;
  created: SDateTime;
  creator: Maybe<DecafPrincipalId>;
  updated: SDateTime;
  updater: Maybe<DecafPrincipalId>;
  guid: string;
  portfolio: DecafPortfolioId;
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
  benchmark: Maybe<DecafOhlcSeriesId>;
  description: Maybe<string>;
  feeScheduleIds: DecafShareClassFeeScheduleId[];
  effectiveFeeScheduleId: Maybe<DecafShareClassFeeScheduleId>;
  subscriptionIds: DecafActionId[];
  outstanding: Maybe<Decimal>;
}

export interface AccountValuationReportExternalValue {
  id: DecafExternalValuationId;
  created: SDateTime;
  creator: Maybe<DecafPrincipalId>;
  updated: SDateTime;
  updater: Maybe<DecafPrincipalId>;
  guid: string;
  portfolio: DecafPortfolioId;
  shareclass: Maybe<DecafShareClassId>;
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
