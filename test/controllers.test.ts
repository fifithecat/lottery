import { Model } from 'objection';
import { Knex, knex } from 'knex';
// import dotenv from 'dotenv';
import * as dotenv from 'dotenv';
import { startNewDraw } from '../src/controller/drawController';
import TicketModel from '../src/db/models/TicketModel';

dotenv.config();

const conn: Record<string, any> = {
  host: process.env.TEST_DB_HOST,
  port: parseInt(process.env.TEST_DB_PORT || '5432', 10),
  user: process.env.TEST_DB_USER,
  password: process.env.TEST_DB_PASSWORD,
};

const testDbConn: Knex.Config = {
  client: 'postgres',
  connection: conn,
  debug: true,
  pool: { min: 0, max: 7 },
};

let testConn = knex(testDbConn);

describe('lottery unit test', () => {
  beforeAll(async () => {
    // drop database and re-create
    await testConn.raw(`drop database if exists ${process.env.TEST_DB_NAME}`);
    await testConn.raw(`create database ${process.env.TEST_DB_NAME}`);
    await testConn.destroy();

    // re-connect with specific database
    conn.database = process.env.TEST_DB_NAME;
    testConn = knex(testDbConn);

    // create schema and seed data in testing database
    await testConn.migrate.latest();
    await testConn.seed.run();

    // ORM connect to the testing database
    Model.knex(testConn);
  });
  test('dummy test', async () => {
    const drawTable = await testConn('draw').select();
    console.log('drawTable ' + JSON.stringify(drawTable));
    const ticketTable = await testConn('ticket').select();
    console.log('ticketTable ' + JSON.stringify(ticketTable));

    const tickets = await TicketModel.query().select();
    console.log('tickets ' + JSON.stringify(tickets));

    expect(1).toEqual(1);
  });
  afterAll(async () => {
    // remove schema and seed data
    await testConn.migrate.rollback();

    // kill connection
    await testConn.destroy();
  });
});
