export const TICKET_STATUS_WIN = 'OPEN';
export const TICKET_STATUS_WIN = 'WON';
export const TICKET_STATUS_LOST = 'LOST';

type Ticket = {

    id: number;
    draw_id: number;
    number_selected: string;
    email: string;
    status: string;
}
export default Ticket;
