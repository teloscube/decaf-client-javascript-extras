import { buildDecafClient, DecafClient, gql } from '@decafhub/decaf-client';
import { safeDiv, zero } from '@telostat/prelude';
import { fail } from 'assert';
import dayjs from 'dayjs';
import { DecafPortfolioId, mkCurrencyCodeError } from './commons';
import { makeValuationReportHoldingsTree } from './reports/valuation/';
import {
  fetchPortfolioValuationReport,
  fetchRemotePortfolioValuationReport,
} from './reports/valuation/-remote-valuation-report-portfolio';

const API_URL = process.env.TESTING_API_URL;
const API_KEY = process.env.TESTING_API_KEY;
const API_SECRET = process.env.TESTING_API_SECRET;

const FIRST_PORTFOLIO_QUERY = gql`
  query GetFirstPortfolio {
    portfolio(limit: 1) {
      id
      name
    }
  }
`;

describe('Main', () => {
  let client: DecafClient;
  let portfolioId: DecafPortfolioId;

  beforeAll(() => {
    jest.resetModules();
    if (!API_URL || !API_KEY || !API_SECRET) {
      throw new Error('Environment variables TESTING_API_URL, TESTING_API_KEY, TESTING_API_SECRET must be set');
    }
    client = buildDecafClient(API_URL, {
      key: API_KEY,
      secret: API_SECRET,
    });
  });

  test('build a valid and authenticated decaf client', async () => {
    const { status } = await client.barista.head('/me/');
    expect(status).toBe(200);
  });

  test('take the first portfolio', async () => {
    try {
      const { data } = await client.microlot.query({ query: FIRST_PORTFOLIO_QUERY });
      portfolioId = data?.portfolio?.[0].id;
      expect(portfolioId).toBeDefined();
    } catch (e) {
      fail('Error while fetching the first portfolio');
    }
  });

  test('get a remote portfolio report successfuly', async () => {
    const eValue = await fetchRemotePortfolioValuationReport(client, {
      portfolio: portfolioId,
      date: dayjs(new Date()).format('YYYY-MM-DD'),
      dateType: 'settlement',
      currency: mkCurrencyCodeError('EUR'),
    });
    eValue.caseOf({
      Left: (e) => fail('Error while fetching the remote portfolio report: ' + e.msg),
      Right: (value) => {
        console.log(
          `Success! remote valuation for portfolio ID ${value.portfolio.id} is reported at ${value.reported}`
        );
        expect(value).toBeDefined();
      },
    });
  });

  test('get a portfolio report, check the tree', async () => {
    const eValue = await fetchPortfolioValuationReport(client, {
      portfolio: portfolioId,
      date: dayjs(new Date()).format('YYYY-MM-DD'),
      dateType: 'settlement',
      currency: mkCurrencyCodeError('EUR'),
    });
    eValue.caseOf({
      Left: (e) => fail('Error while fetching the remote portfolio report: ' + e.msg),
      Right: (value) => {
        console.log(`Success! remote valuation for portfolio ID ${value.portfolio.id} is reported at ${value.asof}`);

        expect(value).toBeDefined();

        const nav = value.figures.nav;
        const inv = value.figures.investment;
        const holdings = value.holdings;
        const tree = makeValuationReportHoldingsTree(nav, inv, holdings);

        expect(tree).toBeDefined();
        expect(safeDiv(tree.totals.netExposure, nav).orDefault(zero)).toEqual(tree.totals.netExposureRatio);
      },
    });
  });
});
