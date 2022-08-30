import { Model } from 'objection';
import { knex } from 'knex';
import { logDbConn } from '../../db_config/postgresConf';
// import * as development from '../../../knexfile';

const logDataConn = knex(logDbConn);
Model.knex(logDataConn);

class TicketModel extends Model {
  id: number | undefined;
  draw_id: number | undefined;
  number_selected: string | undefined;
  email: string | undefined;
  status: string | undefined;

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
