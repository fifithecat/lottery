import _ from 'lodash';
import DrawModel from '../db/models/DrawModel';
import Draw, { DRAW_STATUS_CLOSE, DRAW_STATUS_OPEN } from '../db/type/Draw';
import { DatabaseError, generalError, generateFixedLengthInt } from '../util';

export const closeDraw = async (drawId:number) => {
  const numberDrawn = generateFixedLengthInt(10);
  const drawClosed = await DrawModel.query().where('id', drawId).update({ status: DRAW_STATUS_CLOSE, number_drawn: numberDrawn }).catch((error) => { throw new DatabaseError(JSON.stringify(generalError('Problem arise when closing current draw'))); });
  if (drawClosed !== 1) {
    throw new DatabaseError(JSON.stringify(generalError('Problems arise when closing the draw')));
  }
};

export const startNewDraw = async ():Promise<DrawModel> => {
  const currentDrawId = await DrawModel.query().first().max('id as id').where('status', DRAW_STATUS_OPEN).then((draw) => draw!.id);
  closeDraw(currentDrawId);
  const newDraw:Draw = { status: DRAW_STATUS_OPEN };
  const drawStarted = await DrawModel.query().insert(newDraw).catch((error) => { throw error; });
  return drawStarted;
};

export const getEmailofWinnerByDraw = async (drawId:number) => {
  const ticketOfDraw = await DrawModel.query().select('draw.id').withGraphJoined('ticket').modifyGraph('ticket', (qb) => qb.select(['status','email'])).where('draw_id', drawId).where({'ticket.status': 'WIN'});
};
