import { DecafClient } from '@decafhub/decaf-client';
import { CustomError, customError, Either, Left, Right, SDate } from '@telostat/prelude';
import { CurrencyCode, DateType } from '../../commons';
import { recompileBaseValuationReport, RemoteBaseValuationReport } from './-remote-valuation-report-shared';
import {
  ConsolidatedValuationReport,
  ConsolidatedValuationReportContainer,
  ConsolidatedValuationReportContainerType,
} from './-valuation-report-consolidated';

/**
 * Remote consolidated valuation report query type.
 */
export interface ConsolidatedValuationReportQuery {
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
   * Indication if we want to include/exclude sandbox portfolios (defaults to `true`).
   */
  sandbox?: boolean;

  /**
   * Container type.
   */
  containerType: ConsolidatedValuationReportContainerType;

  /**
   * Container elements (identifiers).
   */
  containerElements: (number | string)[];
}

/**
 * Type definition for the remote (raw) consolidated valuation report data.
 */
export interface RemoteConsolidatedValuationReport extends RemoteBaseValuationReport {
  containers: {
    level: ConsolidatedValuationReportContainerType;
    containers: ConsolidatedValuationReportContainer[];
  };
}

/**
 * Attempts to retrieve remote consolidated valuation report.
 *
 * @param client DECAF Barista client.
 * @param query Remote consolidated valuation report endpoint query parameters.
 * @returns Remote (raw) consolidated valuation report data.
 */
export function fetchRemoteConsolidatedValuationReport(
  client: DecafClient,
  query: ConsolidatedValuationReportQuery
): Promise<Either<CustomError, RemoteConsolidatedValuationReport>> {
  return client.barista
    .get<RemoteConsolidatedValuationReport>('/consolidation/', {
      params: {
        ccy: query.currency,
        date: query.date,
        type: query.dateType,
        sandbox: query.sandbox,
        c: query.containerType,
        i: query.containerElements,
      },
    })
    .then((x) => Right(x.data))
    .catch((err) => Left(customError('Error while attempting to fetch remote consolidated valuation report', err)));
}

/**
 * Attempts to re-compile the raw, remote consolidated valuation report and
 * return it.
 *
 * @param x Raw, remote consolidated valuation report.
 * @returns Either of an error message or the re-compiled consolidated valuation
 * report.
 */
export function recompileConsolidatedValuationReport(
  x: RemoteConsolidatedValuationReport
): Either<CustomError, ConsolidatedValuationReport> {
  // Attempt to get the base valuation report:
  const baseReport = recompileBaseValuationReport(x);

  // Add consolidated valuation report specific fields and return:
  return baseReport.map((report) => ({
    ...report,
    containerType: x.containers.level,
    containers: x.containers.containers,
  }));
}

/**
 * Attempts to retrieve remote consolidated valuation report, compiles it to
 * {@link ConsolidatedValuationReport} and return it.
 *
 * @param client DECAF Barista client.
 * @param query Remote consolidated valuation report endpoint query parameters.
 * @returns Recompiled consolidated valuation report data.
 */
export async function fetchConsolidatedValuationReport(
  client: DecafClient,
  query: ConsolidatedValuationReportQuery
): Promise<Either<CustomError, ConsolidatedValuationReport>> {
  // Attempt to fetch the remote, raw report:
  const rawReport = await fetchRemoteConsolidatedValuationReport(client, query);

  // Attempt to recompile the report (if any) and return:
  return rawReport.chain(recompileConsolidatedValuationReport);
}
