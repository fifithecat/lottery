import _ from 'lodash';
import DrawModel from '../db/models/DrawModel';
import { DatabaseError, generalError, generateFixedLengthInt } from '../util';
import { updateWinningTicketStatus } from './ticketController';

export const DRAW_STATUS_OPEN = 'OPEN';
export const DRAW_STATUS_CLOSE = 'CLOSE';

// close current draw
export const closeDraw = async (drawId:number) => {
  const numberDrawn = generateFixedLengthInt(10);
  const drawClosed = await DrawModel.query().where('id', drawId).update({ status: DRAW_STATUS_CLOSE, number_drawn: numberDrawn })
    .catch((error) => { throw new DatabaseError(JSON.stringify(generalError('Problem arise when closing current draw'))); });
  if (drawClosed !== 1) {
    throw new DatabaseError(JSON.stringify(generalError('Problems arise when closing the draw')));
  }
  await updateWinningTicketStatus(drawId, numberDrawn);
};

// start new draw
export const startNewDraw = async ():Promise<DrawModel> => {
  const currentDrawId = await DrawModel.query().first().max('id as id').where('status', DRAW_STATUS_OPEN).then((draw) => draw!.id);
  if (currentDrawId) {
    await closeDraw(currentDrawId); //
  }
  const newDraw = { status: DRAW_STATUS_OPEN };
  const drawStarted = await DrawModel.query().insert(newDraw)
    .catch((error) => { throw new DatabaseError(JSON.stringify(generalError('Problem arise when starting new draw'))); });
  // console.log(JSON.stringify(drawStarted));
  return drawStarted;
};
