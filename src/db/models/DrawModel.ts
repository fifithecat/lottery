import { Model } from 'objection';
import { knex } from 'knex';
import { logDbConn } from '../../db_config/postgresConf';

const logDataConn = knex(logDbConn);
Model.knex(logDataConn);

class DrawModel extends Model {
  id: number | undefined;
  status: string | undefined;
  number_drawn: string | undefined;

  static get tableName() {
    return 'draw';
  }
}

export default DrawModel;
