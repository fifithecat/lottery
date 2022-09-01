import { Model } from 'objection';
import { Knex, knex } from 'knex';
// import dotenv from 'dotenv';
import * as dotenv from 'dotenv';
import { startNewDraw } from '../src/controller/drawController';

dotenv.config();

const testDbConn: Knex.Config = {
  client: 'postgres',
  connection: {
    host: process.env.TEST_DB_HOST,
    port: parseInt(process.env.TEST_DB_PORT || '5432', 10),
    user: process.env.TEST_DB_USER,
    password: process.env.TEST_DB_PASSWORD,
    database: process.env.TEST_DB_NAME,
  },
};

const testConn = knex(testDbConn);

describe('lottery unit test', () => {
  beforeAll(async () => {
    await testConn.migrate.latest();
    Model.knex(testConn);
  });
  test('dummy test', async () => {
    const drawCreated = await startNewDraw();
    console.log(drawCreated);
    
    expect(1).toEqual(1);
  });
  afterAll(async () => {
    console.log(' 12345 ');
    await testConn.migrate.rollback();
    await testConn.destroy();
    console.log(' 67890 ');
  });
});



console.log(' abcdefg ');
