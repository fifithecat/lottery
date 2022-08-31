import { Knex, knex } from 'knex';
import dotenv from 'dotenv';

dotenv.config();

export const logDbConn: Knex.Config = {
  client: 'postgres',
  connection: {
    host: process.env.APP_DB_HOST,
    port: parseInt(process.env.APP_DB_PORT || '5432', 10),
    user: process.env.APP_DB_USER,
    password: process.env.APP_DB_PASSWORD,
    database: process.env.APP_DB_NAME,
  },
  debug: true,
  pool: { min: 0, max: 7 },
};
