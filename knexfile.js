/*
Example usage:
npx knex init                (generate knexfile.js)
npx knex migrate:make users  (generate migration file template)
npx knex seed:make users     (generate seed file template)
npx knex migrate:latest      (create schema in db)
npx knex seed:run            (insert seed data)
*/
const dotenv = require('dotenv');

dotenv.config();
/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {

  development: {
    client: 'postgresql',
    connection: {
      host: process.env.APP_DB_HOST,
      port: parseInt(process.env.APP_DB_PORT || '5432', 10),
      user: process.env.APP_DB_USER,
      password: process.env.APP_DB_PASSWORD,
      database: process.env.APP_DB_NAME,
    },
  },

};
