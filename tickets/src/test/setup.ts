import { setupTestDb, clearTestData, tearDownTestDb, pool } from './testSetup';
import request from 'supertest';
import { app } from '../app';

beforeAll(async () => {
  await setupTestDb();
});

afterAll(async () => {
  await tearDownTestDb();
});

beforeEach(async () => {
  await clearTestData();
});
