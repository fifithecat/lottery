import TicketModel from "../models/TicketModel";

export const DRAW_STATUS_OPEN = 'OPEN';
export const DRAW_STATUS_CLOSE = 'CLOSE';

type Draw = {

    id?: number;
    status: string;
    number_drawn?: string;
}

export default Draw;