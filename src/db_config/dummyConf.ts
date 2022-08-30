import { Knex, knex } from 'knex';
import dotenv from 'dotenv';
import { getTracker, MockClient } from 'knex-mock-client';
//dotenv.config();

const dummyDbConn: Knex.Config = {
    client: MockClient
};

export {dummyDbConn}; 