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
  DecafActionId,
  DecafExternalValuationId,
  DecafOhlcSeriesId,
  DecafPortfolioId,
  DecafPrincipalId,
  DecafShareClassFeeScheduleId,
  DecafShareClassId,
} from '../../commons';
import { recompileBaseValuationReport, RemoteBaseValuationReport } from './-remote-valuation-report-shared';
import { PortfolioValuationReport, PortfolioValuationReportShareClassValue } from './-valuation-report-portfolio';
import { ValuationReportPortfolio } from './-valuation-report-shared';

/**
 * Remote portfolio valuation report query type.
 */
export interface PortfolioValuationReportQuery {
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
   * Portfolio the valuation report is requested for.
   */
  portfolio: DecafPortfolioId;
}

/**
 * Type definition for the remote (raw) portfolio valuation report data.
 */
export interface RemotePortfolioValuationReport extends RemoteBaseValuationReport {
  portfolio: ValuationReportPortfolio;
  scvals: RemoteValuationShareClassValue[];
  subscriptions?: number;
}

/**
 * Type definition for share class valuation on the remote portfolio valuation
 * report.
 */
export interface RemoteValuationShareClassValue {
  shareclass: RemoteValuationShareClass;
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
 * Type definition for share class on the remote portfolio valuation report.
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
 * Type definition for external valuation on the remote portfolio valuation
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
 * Attempts to retrieve remote portfolio valuation report.
 *
 * @param client DECAF Barista client.
 * @param query Remote portfolio valuation report endpoint query parameters.
 * @returns Remote (raw) portfolio valuation report data.
 */
export function fetchRemotePortfolioValuationReport(
  client: DecafClient,
  query: PortfolioValuationReportQuery
): Promise<Either<CustomError, RemotePortfolioValuationReport>> {
  return client.barista
    .get<RemotePortfolioValuationReport>('/portfolioreport/', {
      params: {
        ccy: query.currency,
        date: query.date,
        type: query.dateType,
        portfolio: `${query.portfolio}`,
      },
    })
    .then((x) => Right(x.data))
    .catch((err) => Left(customError('Error while attempting to fetch remote portfolio valuation report', err)));
}

/**
 * Attempts to recompile remote valuation report share class value.
 *
 * @param x remote valuation report share class value object.
 * @return Recompiled valuation report share class value object.
 */
export function toShareClassValue(x: RemoteValuationShareClassValue): PortfolioValuationReportShareClassValue {
  return {
    shareclass: {
      id: x.shareclass.id,
      created: x.shareclass.created,
      creator: Maybe.fromNullable(x.shareclass.creator),
      updated: x.shareclass.updated,
      updater: Maybe.fromNullable(x.shareclass.updater),
      guid: x.shareclass.guid,
      portfolio: x.shareclass.portfolio,
      name: x.shareclass.name,
      currency: x.shareclass.currency,
      isin: sanitizedNonEmptyText(x.shareclass.isin),
      bbgticker: sanitizedNonEmptyText(x.shareclass.bbgticker),
      liquidity: sanitizedNonEmptyText(x.shareclass.liquidity),
      jurisdiction: sanitizedNonEmptyText(x.shareclass.jurisdiction),
      administrator: sanitizedNonEmptyText(x.shareclass.administrator),
      minimumInvestment: Maybe.fromNullable(x.shareclass.mininvestment),
      subscriptionRedemptionPeriod: sanitizedNonEmptyText(x.shareclass.subredperiod),
      managementFeeFrequency: Maybe.fromNullable(x.shareclass.freqmngt),
      performanceFeeFrequency: Maybe.fromNullable(x.shareclass.freqperf),
      benchmark: Maybe.fromNullable(x.shareclass.benchmark),
      description: sanitizedNonEmptyText(x.shareclass.description),
      feeScheduleIds: x.shareclass.feeschedules,
      effectiveFeeScheduleId: Maybe.fromNullable(x.shareclass.effectivefeeschedule),
      subscriptionIds: x.shareclass.subscriptions,
      outstanding: decimalFromNullable(x.shareclass.outstanding),
    },
    external: Maybe.fromNullable(x.external).map((ev) => ({
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
    nav: unsafeDecimal(x.nav),
    navAdjusted: unsafeDecimal(x.nav_adjusted),
    navAdjustedTotal: unsafeDecimal(x.nav_adjusted_total),
    coefficient: unsafeDecimal(x.coefficient),
    gavRefccy: unsafeDecimal(x.gav_refccy),
    gavClsccy: unsafeDecimal(x.gav_clsccy),
    sharecountPrev: unsafeDecimal(x.sharecount_prev),
    sharecountCurr: unsafeDecimal(x.sharecount_curr),
    sharecountDiff: unsafeDecimal(x.sharecount_diff),
    pxRefCcy: decimalFromNullable(x.px_refccy),
    pxClsCcy: decimalFromNullable(x.px_clsccy),
    ytdExt: decimalFromNullable(x.ytdext),
    ytdInt: decimalFromNullable(x.ytdint),
  };
}

/**
 * Attempts to re-compile the raw, remote portfolio valuation report and
 * return it.
 *
 * @param x Raw, remote portfolio valuation report.
 * @returns Either of an error message or the re-compiled portfolio valuation
 * report.
 */
export function recompilePortfolioValuationReport(
  x: RemotePortfolioValuationReport
): Either<CustomError, PortfolioValuationReport> {
  // Attempt to get the base valuation report:
  const baseReport = recompileBaseValuationReport(x);

  // Add consolidated valuation report specific fields and return:
  return baseReport.map((report) => {
    return {
      ...report,
      portfolio: x.portfolio,
      subscriptions: decimalFromNullable(x.subscriptions).orDefault(zero),
      shareClassValues: x.scvals.map(toShareClassValue),
    };
  });
}

/**
 * Attempts to retrieve remote portfolio valuation report, compiles it to
 * {@link PortfolioValuationReport} and return it.
 *
 * @param client DECAF Barista client.
 * @param query Remote portolio valuation report endpoint query parameters.
 * @returns Recompiled portolio valuation report data.
 */
export async function fetchPortfolioValuationReport(
  client: DecafClient,
  query: PortfolioValuationReportQuery
): Promise<Either<CustomError, PortfolioValuationReport>> {
  // Attempt to fetch the remote, raw report:
  const rawReport = await fetchRemotePortfolioValuationReport(client, query);

  // Attempt to recompile the report (if any) and return:
  return rawReport.chain(recompilePortfolioValuationReport);
}
