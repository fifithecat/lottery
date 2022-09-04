import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { knex } from 'knex';
import { Model } from 'objection';
import { auth } from 'express-oauth2-jwt-bearer';
import { DatabaseError, generalError, ValidationError } from './util';
import { getTicketByTicketId, getWinnersEmailByDrawId, newTicket } from './controller/ticketController';
import { startNewDraw } from './controller/drawController';
import { logDbConn } from './db_config/postgresConf';

dotenv.config();

const checkJwt = auth({
  audience: process.env.oauth_audience,
  issuerBaseURL: process.env.oauth_issuerBaseURL,
});

const STATUS_OK:number = 200;
const STATUS_ERROR:number = 400;

const PORT = process.env.APP_SERVER_PORT || 3000;
const app: Express = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const logDataConn = knex(logDbConn);
Model.knex(logDataConn);

app.get('/api/private', checkJwt, (req: Request, res: Response) => {
  res.status(STATUS_OK).send({ message: 'Hello from a private endpoint! You need to be authenticated to see this.' });
});

// start new draw
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
// issue new ticket
app.post('/join-next-draw', async (req: Request, res: Response) => {
  let ticketIssued;
  try {
    // As only email is required from user, so no need to validate with Json Schema
    // const validationErr = validateWithJsonSchema(req.body, Ticket);
    // if (validationErr.length > 0) {
    //   throw new ValidationError(JSON.stringify(validationErr));
    // }
    if (req.body.email) {
      ticketIssued = await newTicket(req.body.email).catch((error) => { throw error; });
    } else {
      res.status(STATUS_ERROR).send((generalError('Please provide valid email')));
    }
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
// query single ticket status by ticket id
app.get('/query', async (req: Request, res: Response) => {
  if (req.query.ticketId) {
    const drawID = parseInt(req.query.ticketId as string);
    const ticket = await getTicketByTicketId(drawID);
    if (!ticket) {
      res.status(STATUS_ERROR).send(generalError('Cannot find this ticket. Please check the ticket number'));
      return;
    }
    res.status(STATUS_OK).send(ticket);
  } else {
    res.status(STATUS_ERROR).send((generalError('Please provide valid ticket Id')));
  }
});
// retrieve tickets email that win the lottery by draw id
app.get('/notify', async (req: Request, res: Response) => {
  if (req.query.drawId && req.query.drawId) {
    const drawID = parseInt(req.query.drawId as string);
    const ticketsWonLottery = await getWinnersEmailByDrawId(drawID);
    if (ticketsWonLottery.length === 0) {
      res.status(STATUS_ERROR).send(generalError('No ticket win in this draw'));
      return;
    }
    res.status(STATUS_OK).send(ticketsWonLottery);
    return;
  }
  res.status(STATUS_ERROR).send((generalError('Please provide valid draw Id')));
});
app.listen(PORT, () => console.log(`Running on ${PORT} ⚡`));
