npx knex init                (generate knexfile.js)
npx knex migrate:make users  (generate migration file template)
npx knex seed:make users     (generate seed file template)
npx knex migrate:latest      (create schema in db)
npx knex seed:run            (insert seed data)

export APP_DB_HOST=localhost
export APP_DB_PORT=5535
export APP_DB_PASSWORD=password
export APP_DB_USER=postgres
export APP_DB_NAME=postgres

Migrations: create/ drop schema
Seeds: initial data

export APP_DB_HOST=192.168.201.1
export APP_DB_PORT=5432
export APP_DB_USER=dbadmin
export APP_DB_PASSWORD='abcd1234'
export APP_DB_NAME=postgres

set APP_DB_HOST=192.168.201.1
set APP_DB_PORT=5432
set APP_DB_USER=dbadmin
set APP_DB_PASSWORD=abcd1234
set APP_DB_NAME=postgres

set APP_DB_HOST=192.168.201.1
set APP_DB_PORT=5432
set APP_DB_USER=dbadmin
set APP_DB_PASSWORD=abcd1234
set APP_DB_NAME=postgres