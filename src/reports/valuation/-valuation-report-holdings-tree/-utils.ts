import { Maybe } from '@telostat/prelude';
import { ValuationReportHolding } from '../-valuation-report-shared';
import { AvailableAddresserKeys, HoldingAddress, HoldingAddresser } from './-types';

export function compareStringArrays(x: string[], y: string[]): number {
  const xLen = x.length;
  const yLen = y.length;
  const minLength = Math.min(xLen, yLen);

  for (let i = 0; i < minLength; i++) {
    const comparison = (x[i] || '').localeCompare(y[i] || '');

    if (comparison !== 0) {
      return comparison;
    }
  }

  return Math.sign(xLen - yLen);
}

export function composeHoldingAddressers(addressers: Array<HoldingAddresser>): HoldingAddresser {
  return (holding: ValuationReportHolding) =>
    addressers.reduce((p: HoldingAddress, c: HoldingAddresser) => [...p, ...c(holding)], []);
}

export function makeSimpleAddresser(
  def: string,
  labeler: (holding: ValuationReportHolding) => Maybe<string>
): HoldingAddresser {
  return (holding: ValuationReportHolding) => {
    // Attempt to get the label:
    const label = labeler(holding).orDefault('') || def;

    // Get the value:
    const value = label.toUpperCase();

    // Done, return:
    return [{ name: value, order: def }];
  };
}

export const addressers: Record<AvailableAddresserKeys, HoldingAddresser> = {
  classification: (holding: ValuationReportHolding) => {
    // Get the classification:
    const classification = holding.classification;

    // Build the address and return:
    return classification.map((x) => ({
      // label: x.name,
      name: x.name.toUpperCase(),
      order: `${x.order}`.toUpperCase(),
    }));
  },
  currency: makeSimpleAddresser('[Undefined Currency]', (holding: ValuationReportHolding) => holding.artifact.ccy),
  country: makeSimpleAddresser('[Undefined Country]', (holding: ValuationReportHolding) => holding.artifact.country),
  issuer: makeSimpleAddresser('[Undefined Issuer]', (holding: ValuationReportHolding) => holding.artifact.issuer),
  sector: makeSimpleAddresser('[Undefined Sector]', (holding: ValuationReportHolding) => holding.artifact.sector),
};
