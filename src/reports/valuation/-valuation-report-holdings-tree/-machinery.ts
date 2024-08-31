import { Decimal, Just, List, Maybe, Nothing, safeDiv, sumDecimals, Tuple, zero } from '@telostat/prelude';
import { ValuationReportHolding, ValuationReportHoldingClassification } from '../-valuation-report-shared';
import { DecafArtifactTypeId } from '../../../commons';
import {
  AvailableAddresserKeys,
  ValuationReportHoldingsTreeNode,
  ValuationReportHoldingsTreeNodeValue,
} from './-types';
import { addressers, compareStringArrays } from './-utils';

export function makeValuationReportHoldingsTreeNodeValue(): ValuationReportHoldingsTreeNodeValue {
  return {
    investment: zero,
    accrued: Nothing,
    netValue: zero,
    netValueRatio: zero,
    absValue: zero,
    absValueRatio: zero,
    netExposure: zero,
    netExposureRatio: zero,
    absExposure: zero,
    absExposureRatio: zero,
    pnl: zero,
    pnlRatio: zero,
  };
}

export function updateTotals(
  nav: Decimal,
  investment: Decimal,
  tree: ValuationReportHoldingsTreeNode
): ValuationReportHoldingsTreeNodeValue {
  const holdings = tree.holdings;
  const children = tree.children;

  const netValue = sumDecimals(holdings.map((x) => x.valuation.value.net.ref)).add(
    sumDecimals(children.map((x) => x.totals.netValue))
  );
  const absValue = sumDecimals(holdings.map((x) => x.valuation.value.abs.ref)).add(
    sumDecimals(children.map((x) => x.totals.absValue))
  );

  const holdingsForExposure = holdings.filter(
    (h) =>
      !(
        h.artifact.type.id === ('CCY' as unknown as DecafArtifactTypeId) ||
        h.artifact.type.id === ('DEPO' as unknown as DecafArtifactTypeId) ||
        h.artifact.type.id === ('LOAN' as unknown as DecafArtifactTypeId)
      )
  );

  const netExposure = sumDecimals(holdingsForExposure.map((x) => x.valuation.exposure.net.ref)).add(
    sumDecimals(children.map((x) => x.totals.netExposure))
  );
  const absExposure = sumDecimals(holdingsForExposure.map((x) => x.valuation.exposure.abs.ref)).add(
    sumDecimals(children.map((x) => x.totals.absExposure))
  );
  const pnl = sumDecimals(holdings.map((x) => x.pnl)).add(sumDecimals(children.map((x) => x.totals.pnl)));

  const accruedsHoldings = holdings.map((x) => x.investment.accrued.map((x) => x.ref));
  const accruedsChildren = children.map((x) => x.totals.accrued);
  const accrueds = Maybe.catMaybes([...accruedsHoldings, ...accruedsChildren]);

  return {
    investment: sumDecimals(holdings.map((x) => x.investment.value.ref)).add(
      sumDecimals(children.map((x) => x.totals.investment))
    ),
    accrued: accrueds.length === 0 ? Nothing : Just(sumDecimals(accrueds)),
    netValue,
    netValueRatio: safeDiv(netValue, nav).orDefault(zero),
    absValue,
    absValueRatio: safeDiv(absValue, nav).orDefault(zero),
    netExposure,
    netExposureRatio: safeDiv(netExposure, nav).orDefault(zero),
    absExposure,
    absExposureRatio: safeDiv(absExposure, nav).orDefault(zero),
    pnl,
    pnlRatio: safeDiv(pnl, investment).orDefault(zero),
  };
}

export function resortChildren(node: ValuationReportHoldingsTreeNode): ValuationReportHoldingsTreeNode[] {
  return node.children.sort((t1, t2) => {
    // Get current address segments:
    const segment1 = List.last(t1.address);
    const segment2 = List.last(t2.address);

    // Compare and return:
    return segment1
      .chain((s1) => segment2.chain((s2) => Just(Tuple(s1, s2))))
      .map((x) => x.toArray())
      .map(([x, y]) => `${x.order}`.localeCompare(`${y.order}`))
      .orDefaultLazy(() => (segment1.isNothing() ? -1 : 1));
  });
}

export function retreatTree(nav: Decimal, investment: Decimal, tree: ValuationReportHoldingsTreeNode) {
  // First, retreat all children (recursive):
  tree.children.forEach((x) => retreatTree(nav, investment, x));

  // Recompute totals:
  tree.totals = updateTotals(nav, investment, tree);

  // Resort children:
  tree.children = resortChildren(tree);
}

export function makeValuationReportHoldingsTreeNode(
  address: ValuationReportHoldingClassification
): ValuationReportHoldingsTreeNode {
  return {
    name: List.last(address)
      .map((x) => x.name)
      .orDefault(''),
    address,
    holdings: [],
    children: [],
    totals: makeValuationReportHoldingsTreeNodeValue(),
  };
}

export function addValuationReportHoldingToTree(
  tree: ValuationReportHoldingsTreeNode,
  address: ValuationReportHoldingClassification,
  holding: ValuationReportHolding
): void {
  // Get the starting (current) node:
  let node = tree;

  // Iterate over address and traverse the tree while adding new nodes when required:
  const sofar: string[] = [];
  const sofarAddress: ValuationReportHoldingClassification = [];

  for (const segment of address) {
    // Append to address buffer:
    sofar.push(segment.name);
    sofarAddress.push(segment);

    // Attempt to find the child:
    let child = node.children.find(
      (n) =>
        compareStringArrays(
          n.address.map((x) => x.name),
          sofar
        ) === 0
    );

    // Add or use?
    if (child === undefined) {
      // Create the new node:
      child = makeValuationReportHoldingsTreeNode([...sofarAddress]);

      // Add the new node to the current node as a child:
      node.children.push(child);
    }

    // Set the current node to the child:
    node = child;
  }

  // Done, we append the holding to the current node and return from the procedure:
  node.holdings.push(holding);
}

export function makeValuationReportHoldingsTree(
  nav: Decimal,
  investment: Decimal,
  holdings: ValuationReportHolding[],
  addressKey: AvailableAddresserKeys = 'classification'
): ValuationReportHoldingsTreeNode {
  // Initialize the tree:
  const tree = makeValuationReportHoldingsTreeNode([]);
  tree.name = '« Total »';

  // Iterate over the holdings and attempt to add to the tree:
  for (const holding of holdings) {
    // Get the address of the holding:
    const address = addressers[addressKey](holding);

    addValuationReportHoldingToTree(tree, address, holding);
  }

  // Retreat the tree:
  retreatTree(nav, investment, tree);

  // Done, return:
  return tree;
}
