import _ from 'lodash';
import DrawModel from '../db/models/DrawModel';
import TicketModel from '../db/models/TicketModel';
import { DRAW_STATUS_OPEN } from '../db/type/Draw';
import Ticket from '../db/type/Ticket';
import { ValidationError, generalError, generateFixedLengthInt, DatabaseError } from '../util';

export const newTicket = async (ticket:Ticket) => {
  const currentDraw = await DrawModel.query().max('id').where('status', DRAW_STATUS_OPEN);
  const currentDrawId = parseInt(_.map(currentDraw, 'max').join(''), 10);
  console.log('eqweqwe ' + currentDraw);
  console.log('eqweqwe ' + currentDrawId);
  if (Number.isNaN(currentDrawId)) {
    throw new DatabaseError(JSON.stringify(generalError('No draw available')));
  }
  const gotTicket = await TicketModel.query().select().where('draw_id', currentDrawId).where('email', ticket.email).resultSize();
  console.log('gotTicket ' + gotTicket);
  console.log('ticket ' + JSON.stringify(ticket));
  if (gotTicket === 0) {
    ticket.number_selected = generateFixedLengthInt(10);
    ticket.status = DRAW_STATUS_OPEN;
    ticket.draw_id = currentDrawId;
    console.log('ticket ' + JSON.stringify(ticket));
    const ticketIssued = await TicketModel.query().insert(ticket).catch((error) => { console.log(error); throw error; });
    console.log('ticket ' + JSON.stringify(ticket));
    return ticketIssued;
  }
  throw new ValidationError(JSON.stringify(generalError('Already got ticket for this draw')));
};
