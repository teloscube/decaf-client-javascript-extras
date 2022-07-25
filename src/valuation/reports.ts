import { Id } from '../prelude';

/**
 * Type of Valuation Report.
 */
export type ValuationReportType = {
  id: Id;
  name: string;
  description: string;
  type: string;
};

/**
 * generates valuation report.
 * @returns {ValuationReportType}
 */
export function getValuationReport(): ValuationReportType {
  return {
    id: 'default',
    name: 'Default',
    description: 'Default valuation report',
    type: 'default',
  };
}
