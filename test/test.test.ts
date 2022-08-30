import { Model } from 'objection';
import { Knex, knex } from 'knex';
import * as dotenv from 'dotenv';

dotenv.config({path: __dirname + '/.env'})

const testDbConn: Knex.Config = {
  client: 'postgres',
  connection: {
    host: process.env.TEST_DB_HOST,
    port: parseInt(process.env.TEST_DB_PORT || '5432', 10),
    user: process.env.TEST_DB_USER,
    password: process.env.TEST_DB_PASSWORD,
    database: process.env.TEST_DB_NAME,
  }
};

const testConn = knex(testDbConn);

describe('lottery unit test', () => {
  beforeAll(async () => {
    await testConn.migrate.latest();
    await testConn.seed.run();
  });
  test('dummy test', async () => {
    expect(1).toEqual(1);
  });
  afterAll(async () => {
    await testConn.migrate.rollback();
    await testConn.destroy();
  });
});
