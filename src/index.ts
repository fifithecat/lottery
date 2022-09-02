import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import _ from 'lodash';
import { knex } from 'knex';
import { Model } from 'objection';
import { DatabaseError, validateWithJsonSchema, ValidationError } from './util';
import Ticket from './db/models/TicketModel';
import { getTicketByTicketId, newTicket } from './controller/ticketController';
import { startNewDraw } from './controller/drawController';
import { logDbConn } from './db_config/postgresConf';

dotenv.config();

const STATUS_OK:number = 200;
const STATUS_ERROR:number = 400;

const PORT = process.env.APP_SERVER_PORT || 3000;
const app: Express = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const logDataConn = knex(logDbConn);
Model.knex(logDataConn);

app.post('/start-new-draw', async (req: Request, res: Response) => {
  let newDraw;
  try {
    newDraw = await startNewDraw();
  } catch (error) {
    if (error instanceof DatabaseError) {
      res.status(STATUS_ERROR).send(JSON.parse(error.message));
      return;
    }
  }
  res.status(STATUS_OK).send(newDraw);
});
app.post('/join-next-draw', async(req: Request, res: Response) => {
  let ticketIssued;
  try {
    const validationErr = validateWithJsonSchema(req.body, Ticket);
    if (validationErr.length > 0) {
      throw new ValidationError(JSON.stringify(validationErr));
    }
    ticketIssued = await newTicket(req.body).catch((error) => { throw error; });
  } catch (error) {
    if (error instanceof ValidationError) {
      res.status(STATUS_ERROR).send(JSON.parse(error.message));
      return;
    }
    if (error instanceof DatabaseError) {
      res.status(STATUS_ERROR).send(JSON.parse(error.message));
      return;
    }
  }
  res.status(STATUS_OK).send(ticketIssued);
});
app.get('/query', async (req: Request, res: Response) => {
  if (req.query.ticketId && req.query.ticketId) {
    const drawID = parseInt(req.query.ticketId as string);
    const ticket = await getTicketByTicketId(drawID);
    if (!ticket) {
      res.status(STATUS_OK).send({Message: 'Cannot find this ticket. Please check the ticket number'});
      return;
    }
    res.status(STATUS_OK).send(ticket);
  } else {
    res.status(STATUS_ERROR).send({Error: 'Please provide valid ticket id'});
  }
});
app.get('/notify', (req: Request, res: Response) => {

  res.send('<h1>notify-winner</h1>');
});
app.listen(PORT, () => console.log(`Running on ${PORT} ⚡`))