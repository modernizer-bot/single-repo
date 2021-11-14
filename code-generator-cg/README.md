# Code-generator(cg)

## How to run generated code
1. npm install
2. npm start



## How to test generated code
1. docker compose -f postgres_dev.yml up -d
2. cat sample_db_backup.sql | psql -h localhost -U postgres
3. npm start
4. write test file to test client api

## How to load .sql file to postgres
cat sample_db_backup.sql | psql -h localhost -U postgres postgres