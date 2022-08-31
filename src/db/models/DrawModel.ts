import { Model } from 'objection';

import TicketModel from './TicketModel';

class DrawModel extends Model {
  id!: number;
  status!: string;
  number_drawn: string | undefined;

  static get tableName() {
    return 'draw';
  }

  static get relationMappings() {
    return {
      ticket: {
        relation: Model.HasManyRelation,
        modelClass: TicketModel,
        join: {
          from: 'draw.id',
          to: 'ticket.draw_id',
        },
      },

    };
  }
}

export default DrawModel;
