import { Decimal, Maybe } from '@telostat/prelude';
import { ValuationReportHolding, ValuationReportHoldingClassification } from '../-valuation-report-shared';

export interface ValuationReportHoldingsTreeNode {
  name: string;
  address: ValuationReportHoldingClassification;
  holdings: ValuationReportHolding[];
  children: ValuationReportHoldingsTreeNode[];
  totals: ValuationReportHoldingsTreeNodeValue;
}

export interface ValuationReportHoldingsTreeNodeValue {
  investment: Decimal;
  accrued: Maybe<Decimal>;
  netValue: Decimal;
  netValueRatio: Decimal;
  absValue: Decimal;
  absValueRatio: Decimal;
  netExposure: Decimal;
  netExposureRatio: Decimal;
  absExposure: Decimal;
  absExposureRatio: Decimal;
  pnl: Decimal;
  pnlRatio: Decimal;
}
