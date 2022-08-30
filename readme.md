## what is this API?

What is this project for?

data synchronization by batch, retrieve data from source database (oracle), doing some data transformation/manipulation, send the data - batch of array of objects to external API, log the progress to own database (postgres)


How to select the data batch?

Currently no business requirement available, probably depends on datetime, the last id/no selected 


What is the purpose of logging?

Facilitate to understand/troubleshoot the migration progress without retrieval the source database 


Which layers/DB/external API integrated with

Oracle database - database which stored the source data to be migrate
External API - currently do not have any information, assume to be some restful API
Postgres database - database which we insert synchronization/ migration logging for each data batch


## How to start

http://localhost:3000/sync

trigger the start of the whole process - select data, invoke external API (to send data), receive confirmation from external API, log the activity

Additional process during development phase - create schema, sample data to simulate the source data. Create schema for the logging table

## How to run test