import { setupTestDb, clearTestData, tearDownTestDb } from './testSetup';

jest.mock('../config/db', () => {
  const { pool } = require('./testSetup');
  return { __esModule: true, default: pool } 
});


beforeAll(async () => {
  await setupTestDb();
});


jest.mock('../nats-wrapper')

afterAll(async () => {
  await tearDownTestDb();
});

beforeEach(async () => {
  jest.clearAllMocks()
  await clearTestData();
});
