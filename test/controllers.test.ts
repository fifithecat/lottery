import { Model } from 'objection';
import { Knex, knex } from 'knex';
// import dotenv from 'dotenv';
import * as dotenv from 'dotenv';
import { closeDraw, DRAW_STATUS_OPEN, startNewDraw } from '../src/controller/drawController';
import TicketModel from '../src/db/models/TicketModel';
import DrawModel from '../src/db/models/DrawModel';
import { getTicketByTicketId, getWinnersEmailByDrawId, newTicket, TICKET_STATUS_WON } from '../src/controller/ticketController';

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
  test('getTicketByTicketId', async () => {
    const ticketFromDb = await testConn('ticket').select().first().where('id', 1);
    const ticketFromController = await getTicketByTicketId(1);
    expect(ticketFromController).toEqual(ticketFromDb);
  });
  test('getWinnersEmailByDrawId', async () => {
    const winnerEmailFromDb = await testConn('ticket').select('email').where('status', TICKET_STATUS_WON).where('draw_id', 1);
    const winnerEmailFromController = await getWinnersEmailByDrawId(1);
    expect(winnerEmailFromController).toMatchObject(winnerEmailFromDb);
  });
  test('newTicket (no draw available)', async () => {
    const checkAvailableDrawFromDb = await (await testConn('draw').select().where('status', DRAW_STATUS_OPEN)).length;

    if (checkAvailableDrawFromDb > 0) {
      throw new Error('Should got zero open draw, sample data error');
    }

    await newTicket('abc@def.com').catch((error: { message: any; }) => {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toMatch('{"Error":"Problem when issuing ticket"}');
    });
  });
  test('new draw (no other open draw)', async () => {
    const checkAvailableDrawFromDb = await (await testConn('draw').select().where('status', DRAW_STATUS_OPEN)).length;

    if (checkAvailableDrawFromDb > 0) {
      throw new Error('Should got zero open draw, sample data error');
    }
    const newDrawByController:any = await startNewDraw();
    const drawFromDb = await (await testConn('draw').select().where('status', DRAW_STATUS_OPEN));
    expect(drawFromDb.length).toEqual(1); // one new draw created

    expect(newDrawByController.id).toEqual(drawFromDb[0].id);
    expect(newDrawByController.status).toEqual(drawFromDb[0].status);
  });
  test('close draw', async () => {
    let availableDrawFromDb = await (await testConn('draw').select().where('status', DRAW_STATUS_OPEN));

    if (availableDrawFromDb.length !== 1) {
      throw new Error('Should got one open draw, sample data error');
    }

    await closeDraw(availableDrawFromDb[0].id);
    let availableDrawFromDbAfterClose = await (await testConn('draw').select().where('status', DRAW_STATUS_OPEN));
    expect(availableDrawFromDbAfterClose.length).toEqual(0);

    const drawClosed = await testConn('draw').select().first().where('id', availableDrawFromDb[0].id);
    expect(drawClosed.number_drawn).not.toBeNull();
  });
  afterAll(async () => {
    // remove schema and seed data
    await testConn.migrate.rollback();

    // kill connection
    await testConn.destroy();
  });
});
