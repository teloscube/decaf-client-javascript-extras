import { DecafClient } from '@decafhub/decaf-client';
import {
  CustomError,
  customError,
  decimalFromNullable,
  Either,
  Left,
  Maybe,
  Right,
  sanitizedNonEmptyText,
  SDate,
  SDateTime,
  unsafeDecimal,
  zero,
} from '@telostat/prelude';
import {
  CurrencyCode,
  DateType,
  DecafAccountId,
  DecafActionId,
  DecafExternalValuationId,
  DecafOhlcSeriesId,
  DecafPortfolioId,
  DecafPrincipalId,
  DecafShareClassFeeScheduleId,
  DecafShareClassId,
} from '../../commons';
import { recompileBaseValuationReport, RemoteBaseValuationReport } from './-remote-valuation-report-shared';
import { ValuationReportAccount } from './-valuation-report-shared';
import { AccountValuationReport, AccountValuationReportShareClassValue } from './-valuation-report-account';

/**
 * Remote account valuation report query type.
 */
export interface AccountValuationReportQuery {
  /**
   * Date of valuation report.
   */
  date: SDate;

  /**
   * Date type of the valuation report.
   */
  dateType: DateType;

  /**
   * Reference currency of the valuation report.
   */
  currency: CurrencyCode;

  /**
   * Account the valuation report is requested for.
   */
  account: DecafAccountId;
}

/**
 * Type definition for the remote (raw) account valuation report data.
 */
export interface RemoteAccountValuationReport extends RemoteBaseValuationReport {
  account: ValuationReportAccount;
  scvals: RemoteValuationShareClassValue[];
  subscriptions?: number;
}

/**
 * Type definition for share class valuation on the remote account valuation
 * report.
 */
export interface RemoteValuationShareClassValue {
  shareclass?: RemoteValuationShareClass;
  external?: RemoteValuationExternalValue;
  nav: number;
  nav_adjusted: number;
  nav_adjusted_total: number;
  coefficient: number;
  gav_refccy: number;
  gav_clsccy: number;
  sharecount_prev: number;
  sharecount_curr: number;
  sharecount_diff: number;
  px_refccy: number;
  px_clsccy: number;
  ytdext?: number;
  ytdint?: number;
}

/**
 * Type definition for share class on the remote account valuation report.
 */
export interface RemoteValuationShareClass {
  id: DecafShareClassId;
  created: SDateTime;
  creator: DecafPrincipalId;
  updated: SDateTime;
  updater: DecafPrincipalId;
  guid: string;
  portfolio: DecafPortfolioId;
  name: string;
  currency: CurrencyCode;
  isin?: string;
  bbgticker?: string;
  liquidity?: string;
  jurisdiction?: string;
  administrator?: string;
  mininvestment?: number;
  subredperiod?: string;
  freqmngt?: number;
  freqperf?: number;
  benchmark?: DecafOhlcSeriesId;
  description?: string;
  feeschedules: DecafShareClassFeeScheduleId[];
  effectivefeeschedule?: DecafShareClassFeeScheduleId;
  subscriptions: DecafActionId[];
  outstanding?: number;
}

/**
 * Type definition for external valuation on the remote account valuation
 * report.
 */
export interface RemoteValuationExternalValue {
  id: DecafExternalValuationId;
  created: SDateTime;
  creator: DecafPrincipalId;
  updated: SDateTime;
  updater: DecafPrincipalId;
  guid: string;
  portfolio: DecafPortfolioId;
  shareclass?: DecafShareClassId;
  date: SDate;
  ccy: CurrencyCode;
  shares?: number;
  price?: number;
  nav?: number;
  aum?: number;
  hedgepnl?: number;
  feemngt?: number;
  feeperf?: number;
  otheraccrued?: number;
  totalaccrued?: number;
  subred?: number;
  perfdaily?: number;
  perfweekly?: number;
  perfmonthly?: number;
  perfytd?: number;
  perfstart?: number;
  coefficient?: number;
}

/**
 * Attempts to retrieve remote account valuation report.
 *
 * @param client DECAF Barista client.
 * @param query Remote account valuation report endpoint query parameters.
 * @returns Remote (raw) account valuation report data.
 */
export async function fetchRemoteAccountValuationReport(
  client: DecafClient,
  query: AccountValuationReportQuery
): Promise<Either<CustomError, RemoteAccountValuationReport>> {
  return client.barista
    .get<RemoteAccountValuationReport>('/reports/valuation/account/', {
      params: {
        ccy: query.currency,
        date: query.date,
        type: query.dateType,
        account: `${query.account}`,
      },
    })
    .then((x) => Right(x.data))
    .catch((err) => Left(customError('Error while attempting to fetch remote account valuation report', err)));
}

/**
 * Attempts to recompile remote valuation report share class value.
 *
 * @param x remote valuation report share class value object.
 * @return Recompiled valuation report share class value object.
 */
export function toShareClassValue(s: RemoteValuationShareClassValue): AccountValuationReportShareClassValue {
  const shareclass = Maybe.fromNullable(s.shareclass).map((x) => ({
    id: x.id,
    created: x.created,
    creator: Maybe.fromNullable(x.creator),
    updated: x.updated,
    updater: Maybe.fromNullable(x.updater),
    guid: x.guid,
    portfolio: x.portfolio,
    name: x.name,
    currency: x.currency,
    isin: sanitizedNonEmptyText(x.isin),
    bbgticker: sanitizedNonEmptyText(x.bbgticker),
    liquidity: sanitizedNonEmptyText(x.liquidity),
    jurisdiction: sanitizedNonEmptyText(x.jurisdiction),
    administrator: sanitizedNonEmptyText(x.administrator),
    minimumInvestment: Maybe.fromNullable(x.mininvestment),
    subscriptionRedemptionPeriod: sanitizedNonEmptyText(x.subredperiod),
    managementFeeFrequency: Maybe.fromNullable(x.freqmngt),
    performanceFeeFrequency: Maybe.fromNullable(x.freqperf),
    benchmark: Maybe.fromNullable(x.benchmark),
    description: sanitizedNonEmptyText(x.description),
    feeScheduleIds: x.feeschedules,
    effectiveFeeScheduleId: Maybe.fromNullable(x.effectivefeeschedule),
    subscriptionIds: x.subscriptions,
    outstanding: decimalFromNullable(x.outstanding),
  }));

  return {
    shareclass,
    external: Maybe.fromNullable(s.external).map((ev) => ({
      id: ev.id,
      created: ev.created,
      creator: Maybe.fromNullable(ev.updater),
      updated: ev.updated,
      updater: Maybe.fromNullable(ev.updater),
      guid: ev.guid,
      portfolio: ev.portfolio,
      shareclass: Maybe.fromNullable(ev.shareclass),
      date: ev.date,
      ccy: ev.ccy,
      shares: decimalFromNullable(ev.shares),
      price: decimalFromNullable(ev.price),
      nav: decimalFromNullable(ev.nav),
      aum: decimalFromNullable(ev.aum),
      hedgepnl: decimalFromNullable(ev.hedgepnl),
      feemngt: decimalFromNullable(ev.feemngt),
      feeperf: decimalFromNullable(ev.feeperf),
      otheraccrued: decimalFromNullable(ev.otheraccrued),
      totalaccrued: decimalFromNullable(ev.totalaccrued),
      subred: decimalFromNullable(ev.subred),
      perfdaily: decimalFromNullable(ev.perfdaily),
      perfweekly: decimalFromNullable(ev.perfweekly),
      perfmonthly: decimalFromNullable(ev.perfmonthly),
      perfytd: decimalFromNullable(ev.perfytd),
      perfstart: decimalFromNullable(ev.perfstart),
      coefficient: decimalFromNullable(ev.coefficient),
    })),
    nav: unsafeDecimal(s.nav),
    navAdjusted: unsafeDecimal(s.nav_adjusted),
    navAdjustedTotal: unsafeDecimal(s.nav_adjusted_total),
    coefficient: unsafeDecimal(s.coefficient),
    gavRefccy: unsafeDecimal(s.gav_refccy),
    gavClsccy: unsafeDecimal(s.gav_clsccy),
    sharecountPrev: Maybe.fromNullable(s.sharecount_prev).map(unsafeDecimal),
    sharecountCurr: Maybe.fromNullable(s.sharecount_curr).map(unsafeDecimal),
    sharecountDiff: Maybe.fromNullable(s.sharecount_diff).map(unsafeDecimal),
    pxRefCcy: decimalFromNullable(s.px_refccy),
    pxClsCcy: decimalFromNullable(s.px_clsccy),
    ytdExt: decimalFromNullable(s.ytdext),
    ytdInt: decimalFromNullable(s.ytdint),
  };
}

/**
 * Attempts to re-compile the raw, remote account valuation report and
 * return it.
 *
 * @param x Raw, remote account valuation report.
 * @returns Either of an error message or the re-compiled account valuation
 * report.
 */
export function recompileAccountValuationReport(
  x: RemoteAccountValuationReport
): Either<CustomError, AccountValuationReport> {
  // Attempt to get the base valuation report:
  const baseReport = recompileBaseValuationReport(x);

  // Add consolidated valuation report specific fields and return:
  return baseReport.map((report) => {
    return {
      ...report,
      account: x.account,
      subscriptions: decimalFromNullable(x.subscriptions).orDefault(zero),
      shareClassValues: x.scvals.map(toShareClassValue),
    };
  });
}

/**
 * Attempts to retrieve remote account valuation report, compiles it to
 * {@link AccountValuationReport} and return it.
 *
 * @param client DECAF Barista client.
 * @param query Remote account valuation report endpoint query parameters.
 * @returns Recompiled account valuation report data.
 */
export async function fetchAccountValuationReport(
  client: DecafClient,
  query: AccountValuationReportQuery
): Promise<Either<CustomError, AccountValuationReport>> {
  // Attempt to fetch the remote, raw report:
  const rawReport = await fetchRemoteAccountValuationReport(client, query);

  // Attempt to recompile the report (if any) and return:
  return rawReport.chain(recompileAccountValuationReport);
}
