import DrawModel from '../db/models/DrawModel';
import Draw, { DRAW_STATUS_OPEN } from '../db/type/Draw';

export const startNewDraw = async ():Promise<DrawModel> => {
  const newDraw:Draw = {status: DRAW_STATUS_OPEN};
  const drawStarted = await DrawModel.query().insert(newDraw).catch((error) => { throw error; });
  return drawStarted;
};
