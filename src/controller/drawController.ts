import _ from 'lodash';
import { Transaction } from 'objection';
import DrawModel from '../db/models/DrawModel';
import { DatabaseError, generalError, generateFixedLengthInt } from '../util';
import { updateWinningTicketStatus } from './ticketController';

export const DRAW_STATUS_OPEN = 'OPEN';
export const DRAW_STATUS_CLOSE = 'CLOSE';

// close current draw (and update winner ticket status)
export const closeDraw = async (drawId:number, trx?:Transaction) => {
  const numberDrawn = generateFixedLengthInt(10);
  const drawClosed = await DrawModel.query(trx).where('id', drawId).update({ status: DRAW_STATUS_CLOSE, number_drawn: numberDrawn })
    .catch((error) => { throw new DatabaseError(JSON.stringify(generalError('Problem arise when closing current draw'))); });
  if (drawClosed !== 1) {
    throw new DatabaseError(JSON.stringify(generalError('Problems arise when closing the draw')));
  }
  await updateWinningTicketStatus(drawId, numberDrawn);
};

// start new draw
export const startNewDraw = async () => {
  const trx = await DrawModel.startTransaction();

  try {
    const currentDrawId = await DrawModel.query().first().max('id as id').where('status', DRAW_STATUS_OPEN).then((draw) => draw!.id);
    if (currentDrawId) {
      await closeDraw(currentDrawId, trx); //
    }
    const newDraw = { status: DRAW_STATUS_OPEN };
    const drawStarted = await DrawModel.query().insert(newDraw)
      .catch((error) => { console.log('create new draw error'); });
    // throw new DatabaseError(JSON.stringify(generalError('Problem arise when starting new draw')));
    await trx.commit();
    return drawStarted;
  } catch (err) {
    await trx.rollback();
    throw new DatabaseError(JSON.stringify(generalError('Problem arise when starting new draw')));
  }
};
