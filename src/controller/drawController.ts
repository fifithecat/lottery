import DrawModel from '../db/models/DrawModel';
import Draw, { DRAW_STATUS_CLOSE, DRAW_STATUS_OPEN } from '../db/type/Draw';
import { DatabaseError, generalError, generateFixedLengthInt } from '../util';

export const startNewDraw = async ():Promise<DrawModel> => {
  const newDraw:Draw = {status: DRAW_STATUS_OPEN};
  const drawStarted = await DrawModel.query().insert(newDraw).catch((error) => { throw error; });
  return drawStarted;
};

export const closeDraw = async (drawId:number) => {
  const numberDrawn = generateFixedLengthInt(10);
  const drawClosed = await DrawModel.query().where('id', drawId).update({ status: DRAW_STATUS_CLOSE, number_drawn: numberDrawn }).catch((error) => { throw error; });
  if (drawClosed !== 1) {
    throw new DatabaseError(JSON.stringify(generalError('Problems during closing the draw')));
  }
};
