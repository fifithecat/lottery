import _ from 'lodash';
import { PartialModelObject } from 'objection';
import DrawModel from '../db/models/DrawModel';
import TicketModel from '../db/models/TicketModel';

import {
  ValidationError, generalError, generateFixedLengthInt, DatabaseError,
} from '../util';
import { DRAW_STATUS_OPEN } from './drawController';

export const TICKET_STATUS_OPEN = 'OPEN';
export const TICKET_STATUS_WON = 'WON';
export const TICKET_STATUS_LOST = 'LOST';

// issue new ticket
export const newTicket = async (email: string) => {
  // check any existing draw available
  const currentDrawId = await DrawModel.query().first().max('id as id').where('status', DRAW_STATUS_OPEN)
    .then((draw) => draw!.id);
  if (Number.isNaN(currentDrawId)) {
    throw new DatabaseError(JSON.stringify(generalError('No draw available')));
  }
  // check the provided email joined the current draw or not
  const gotTicket = await TicketModel.query().select().where('draw_id', currentDrawId).where('email', email)
    .resultSize();
  if (gotTicket === 0) {
    const ticket:PartialModelObject<TicketModel> = {};
    ticket.number_selected = generateFixedLengthInt(10);
    ticket.status = DRAW_STATUS_OPEN;
    ticket.draw_id = currentDrawId;
    ticket.email = email;
    // issue new ticket
    const ticketIssued = await TicketModel.query().insert(ticket)
      .catch((error) => { throw new DatabaseError(JSON.stringify(generalError('Problem when issuing ticket'))); });
    return ticketIssued;
  }
  throw new ValidationError(JSON.stringify(generalError('Already got ticket for this draw')));
};

// get ticket by id
export const getTicketByTicketId = async (ticketId:number) => {
  const ticketOfDraw = await TicketModel.query().first().select().where({ 'ticket.id': ticketId });
  return ticketOfDraw;
};

// get winners email
export const getWinnersEmailByDrawId = async (drawId:number) => {
  const winnerEmails = await TicketModel.query().select('email').where('draw_id', drawId).where({ 'ticket.status': TICKET_STATUS_WON });
  return winnerEmails;
};

// update winner ticket status
export const updateWinningTicketStatus = async (drawId:number, numberDrawn:string) => {
  await TicketModel.query().patch({ status: TICKET_STATUS_WON }).where('draw_id', drawId).where('number_selected', numberDrawn)
    .catch((error) => { throw new DatabaseError(JSON.stringify(generalError('Fail update winners ticket status'))); });
};
