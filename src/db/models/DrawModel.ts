import { Model } from 'objection';
import { knex } from 'knex';
import { logDbConn } from '../../db_config/postgresConf';
import TicketModel from './TicketModel';

const logDataConn = knex(logDbConn);
Model.knex(logDataConn);

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
