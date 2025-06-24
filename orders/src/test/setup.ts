import { setupTestDb, clearTestData, tearDownTestDb, pool } from './testSetup';
import request from 'supertest';
import { app } from '../app';

jest.mock('../nats-wrapper')


beforeAll(async () => {
  await setupTestDb();
});

afterAll(async () => {
  await tearDownTestDb();
});

beforeEach(async () => {
  jest.clearAllMocks()
  await clearTestData();
});
