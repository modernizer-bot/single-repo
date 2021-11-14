const postgres = `@@SIGNATURE@@
const { Pool } = require("pg");
const {
  DB_HOST,
  DB_DATABASE,
  DB_USER,
  DB_PORT,
  DB_PASSWORD,
  LOGGING_DB_QUERY,
} = require("./config");

const pool = new Pool({
  host: DB_HOST,
  port: Number(DB_PORT),
  database: DB_DATABASE,
  user: DB_USER,
  password: DB_PASSWORD,
});

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
module.exports = { query, end };
`;

module.exports = { postgres };
