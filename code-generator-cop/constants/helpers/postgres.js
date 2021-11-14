const postgres = `const { Pool } = require("pg");
const {
  DB_HOST,
  DB_DATABASE,
  DB_USERNAME,
  DB_PORT,
  DB_PASSWORD,
  LOGGING_DB_QUERY,
} = require("./config");

const pool = new Pool({
  host: DB_HOST,
  database: DB_DATABASE,
  user: DB_USERNAME,
  password: DB_PASSWORD,
  port: DB_PORT,
});

const query = (queryObject, close = false) => {
  if (close) {
    return pool.end();
  }
  if (LOGGING_DB_QUERY) {
    console.log({ queryObject });
  }
  return pool.query(queryObject);
};

module.exports = query;

`;

module.exports = postgres;
