// 54f39acd-5943-414f-92a6-afbaf3f97671
const { Pool } = require("pg");

const LOGGING_DB_QUERY = true;

let pool;

/** @type {(queryObject: {text: string, values: any[]}) => any} */
const query = (queryObject) => {
  if (LOGGING_DB_QUERY) {
    console.log({ queryObject });
  }
  return pool.query(queryObject);
};

/** @type {() => Promise<void>} */
const end = () => {
  return pool.end();
};

/** @type {(connectionString: string) => void} */
const connect = (connectionString) => {
  pool = new Pool({
    connectionString,
  });
};
module.exports = { query, end, connect };
