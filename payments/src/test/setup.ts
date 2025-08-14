import { setupTestDb, clearTestData, tearDownTestDb, pool } from './testSetup';
import request from 'supertest';
import { app } from '../app';

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
