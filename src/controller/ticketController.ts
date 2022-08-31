import _ from 'lodash';
import DrawModel from '../db/models/DrawModel';
import TicketModel from '../db/models/TicketModel';
import { DRAW_STATUS_OPEN } from '../db/type/Draw';
import Ticket from '../db/type/Ticket';
import { ValidationError, generalError, generateFixedLengthInt, DatabaseError } from '../util';

export const newTicket = async (ticket:Ticket) => {
  const currentDrawId = await DrawModel.query().first().max('id as id').where('status', DRAW_STATUS_OPEN).then((draw) => draw!.id);
  if (Number.isNaN(currentDrawId)) {
    throw new DatabaseError(JSON.stringify(generalError('No draw available')));
  }
  const gotTicket = await TicketModel.query().select().where('draw_id', currentDrawId).where('email', ticket.email).resultSize();
  if (gotTicket === 0) {
    ticket.number_selected = generateFixedLengthInt(10);
    ticket.status = DRAW_STATUS_OPEN;
    ticket.draw_id = currentDrawId;
    const ticketIssued = await TicketModel.query().insert(ticket).catch((error) => { throw new DatabaseError(JSON.stringify(generalError('Problem when issuing ticket'))); });
    return ticketIssued;
  }
  throw new ValidationError(JSON.stringify(generalError('Already got ticket for this draw')));
};
