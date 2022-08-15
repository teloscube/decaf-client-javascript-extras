import { BaseValuationReport } from './-valuation-report-shared';

/**
 * Type definition for consolidated valuation report.
 */
export interface ConsolidatedValuationReport extends BaseValuationReport {
  /**
   * Type of containers consolidated.
   */
  containerType: ConsolidatedValuationReportContainerType;

  /**
   * Containers consolidated.
   */
  containers: ConsolidatedValuationReportContainer[];
}

/**
 * Type definition for container types to be consolidated.
 */
export type ConsolidatedValuationReportContainerType =
  | 'account'
  | 'portfolio'
  | 'team'
  | 'custodian'
  | 'portfolio-group';

/**
 * Type definition for valuation report containers.
 */
export interface ConsolidatedValuationReportContainer {
  /**
   * Id of the container.
   */
  id: number;

  /**
   * GUID of the container.
   */
  guid: string;

  /**
   * Name of the container.
   */
  name: string;
}
