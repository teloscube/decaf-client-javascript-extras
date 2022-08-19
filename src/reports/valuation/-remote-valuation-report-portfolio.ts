import { DecafClient } from '@decafhub/decaf-client';
import {
  asDecimal,
  CustomError,
  customError,
  Either,
  Left,
  Maybe,
  maybeDecimal,
  Right,
  sanitizedNonEmptyText,
  SDate,
  SDateTime,
  zero,
} from '@telostat/prelude';
import {
  ActionId,
  CurrencyCode,
  DateType,
  ExternalValuationId,
  OhlcSeriesId,
  PortfolioId,
  PrincipalId,
  ShareClassFeeScheduleId,
  ShareClassId,
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
  portfolio: PortfolioId;
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
  id: ShareClassId;
  created: SDateTime;
  creator: PrincipalId;
  updated: SDateTime;
  updater: PrincipalId;
  guid: string;
  portfolio: PortfolioId;
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
  benchmark?: OhlcSeriesId;
  description?: string;
  feeschedules: ShareClassFeeScheduleId[];
  effectivefeeschedule?: ShareClassFeeScheduleId;
  subscriptions: ActionId[];
  outstanding?: number;
}

/**
 * Type definition for external valuation on the remote portfolio valuation
 * report.
 */
export interface RemoteValuationExternalValue {
  id: ExternalValuationId;
  created: SDateTime;
  creator: PrincipalId;
  updated: SDateTime;
  updater: PrincipalId;
  guid: string;
  portfolio: PortfolioId;
  shareclass?: ShareClassId;
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
      outstanding: maybeDecimal(x.shareclass.outstanding),
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
      shares: maybeDecimal(ev.shares),
      price: maybeDecimal(ev.price),
      nav: maybeDecimal(ev.nav),
      aum: maybeDecimal(ev.aum),
      hedgepnl: maybeDecimal(ev.hedgepnl),
      feemngt: maybeDecimal(ev.feemngt),
      feeperf: maybeDecimal(ev.feeperf),
      otheraccrued: maybeDecimal(ev.otheraccrued),
      totalaccrued: maybeDecimal(ev.totalaccrued),
      subred: maybeDecimal(ev.subred),
      perfdaily: maybeDecimal(ev.perfdaily),
      perfweekly: maybeDecimal(ev.perfweekly),
      perfmonthly: maybeDecimal(ev.perfmonthly),
      perfytd: maybeDecimal(ev.perfytd),
      perfstart: maybeDecimal(ev.perfstart),
      coefficient: maybeDecimal(ev.coefficient),
    })),
    nav: asDecimal(x.nav),
    navAdjusted: asDecimal(x.nav_adjusted),
    navAdjustedTotal: asDecimal(x.nav_adjusted_total),
    coefficient: asDecimal(x.coefficient),
    gavRefccy: asDecimal(x.gav_refccy),
    gavClsccy: asDecimal(x.gav_clsccy),
    sharecountPrev: asDecimal(x.sharecount_prev),
    sharecountCurr: asDecimal(x.sharecount_curr),
    sharecountDiff: asDecimal(x.sharecount_diff),
    pxRefCcy: asDecimal(x.px_refccy),
    pxClsCcy: asDecimal(x.px_clsccy),
    ytdExt: maybeDecimal(x.ytdext),
    ytdInt: maybeDecimal(x.ytdint),
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
      subscriptions: maybeDecimal(x.subscriptions).orDefault(zero),
      shareClassValues: x.scvals.map(toShareClassValue),
    };
  });
}

/**
 * Attempts to retrieve remote portfolio valuation report, compiles it to
 * [[PortfolioValuationReport]] and return it.
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
