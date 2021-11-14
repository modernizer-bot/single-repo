const config = `@@SIGNATURE@@
const NODE_ENV = process.env.NODE_ENV || "development";
const LOGGING_DB_QUERY = true;
const PORT = 4000;
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = 1000 * 60 * 60;
const DB_HOST = process.env.DB_HOST;
const DB_PORT = process.env.DB_PORT;
const DB_DATABASE = process.env.DB_DATABASE;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;

console.log({
  NODE_ENV,
  LOGGING_DB_QUERY,
  PORT,
  JWT_SECRET,
  JWT_EXPIRES_IN,
  DB_HOST,
  DB_PORT,
  DB_DATABASE,
  DB_USER,
  DB_PASSWORD,
});

module.exports = {
  NODE_ENV,
  LOGGING_DB_QUERY,
  PORT,
  JWT_SECRET,
  JWT_EXPIRES_IN,
  DB_HOST,
  DB_PORT,
  DB_DATABASE,
  DB_USER,
  DB_PASSWORD,
};
`;

module.exports = { config };
