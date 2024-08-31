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

// export interface HoldingAddressSegment {
//   value: string;
//   label: string;
//   order: string | number;
// }

export type HoldingAddress = ValuationReportHoldingClassification; // HoldingAddressSegment[];
export type HoldingAddresser = (holding: ValuationReportHolding) => HoldingAddress;
export type AvailableAddresserKeys = 'classification' | 'currency' | 'country' | 'issuer' | 'sector';
