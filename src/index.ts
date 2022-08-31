import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import _ from 'lodash';
import { DatabaseError, generateFixedLengthInt, validateWithJsonSchema } from './util';
import {ValidationError} from './util';
import Ticket from './db/models/TicketModel';
import { newTicket } from './controller/ticketController';
import { closeDraw, startNewDraw } from './controller/drawController';

dotenv.config();

const STATUS_OK:number = 200;
const STATUS_ERROR:number = 400;

const PORT = process.env.SERVER_PORT || 3000;
const app: Express = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

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
  await closeDraw(3);
});
app.get('/notify', (req: Request, res: Response) => {

  res.send('<h1>notify-winner</h1>');
});
app.listen(PORT, () => console.log(`Running on ${PORT} ⚡`))