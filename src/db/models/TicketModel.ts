import { Model } from 'objection';
import { knex } from 'knex';
import { logDbConn } from '../../db_config/postgresConf';
// import * as development from '../../../knexfile';

const logDataConn = knex(logDbConn);
Model.knex(logDataConn);

class TicketModel extends Model {
  id!: number;
  draw_id!: number;
  number_selected!: string;
  email!: string;
  status!: string;

  static get tableName() {
    return 'ticket';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['email'],
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
