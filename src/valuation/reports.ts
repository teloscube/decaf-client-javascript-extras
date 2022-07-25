import { Id } from '../prelude';

export type ValuationReportType = {
  id: Id;
  name: string;
  description: string;
  type: string;
};

export function getValuationReportTypes(): ValuationReportType[] {
  return [
    {
      id: 'default',
      name: 'Default',
      description: 'Default valuation report',
      type: 'default',
    },
  ];
}
