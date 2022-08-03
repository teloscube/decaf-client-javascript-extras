import { buildDecafClient, DecafClient } from '@decafhub/decaf-client';

const API_URL = process.env.TESTING_API_URL;
const API_KEY = process.env.TESTING_API_KEY;
const API_SECRET = process.env.TESTING_API_SECRET;

describe('index', () => {
  let client: DecafClient;

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

  test('should build the decaf client', () => {
    expect(client.barista).toBeDefined();
    expect(client.microlot).toBeDefined();
    expect(client.bare).toBeDefined();
  });
});
