##/start-new-draw
close current draw - generate number and notify winner
create new draw (and return new draw information)


##/join-next-draw
check input json body valid - should contains email
check any draw coming available
check contestant(email) participated in thay draw or not, reject if participated
issue ticket (and return issued ticket) if meet the above requirement


##/query


##/notify-winner


##framework/ tools using
objection
knex
eslint
typescript
docker
postgresql docker image