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

describe('Emergency Drill GET APIs', () => {
  beforeAll(async () => {
    console.log(process.env.TEST_DB_HOST);
    await testConn.migrate.latest();
  });
  test('assigned drill for vessel', async () => {
    expect(1).toEqual(1);
  });
  afterAll(async () => {
    await testConn.destroy();
  });
});
