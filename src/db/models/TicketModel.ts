import { Model } from 'objection';

class TicketModel extends Model {
  id!: number;
  draw_id!: number;
  number_selected!: string;
  email!: string;
  status!: string;

  static get tableName() {
    return 'ticket';
  }

  // it validates the input object in every database insert
  static get jsonSchema() {
    return {
      type: 'object',
      required: ['draw_id', 'email', 'number_selected', 'status'],
      properties: {
        draw_id: { type: 'integer' },
        email: { type: 'string' },
        number_selected: { type: 'string', minLength: 10, maxLength: 10 },
        status: { type: 'string' },
      },
    };
  }
}

export default TicketModel;
