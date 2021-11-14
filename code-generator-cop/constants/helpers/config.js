const config = `const { NODE_ENV } = process.env;
const PORT = Number(process.env.PORT);
const { COOKIE_DOMAIN } = process.env;
const LOGGING_DB_QUERY = process.env.LOGGING_DB_QUERY === "true";
const { JWT_SECRET } = process.env;
const JWT_EXPIRES_IN = Number(process.env.JWT_EXPIRES_IN);
const { DB_HOST } = process.env;
const DB_PORT = Number(process.env.DB_PORT);
const { DB_DATABASE } = process.env;
const { DB_USERNAME } = process.env;
const { DB_PASSWORD } = process.env;

console.log({
  NODE_ENV,
  PORT,
  COOKIE_DOMAIN,
  LOGGING_DB_QUERY,
  JWT_SECRET,
  JWT_EXPIRES_IN,
  DB_HOST,
  DB_PORT,
  DB_DATABASE,
  DB_USERNAME,
  DB_PASSWORD,
});

module.exports = {
  NODE_ENV,
  PORT,
  COOKIE_DOMAIN,
  LOGGING_DB_QUERY,
  JWT_SECRET,
  JWT_EXPIRES_IN,
  DB_HOST,
  DB_PORT,
  DB_DATABASE,
  DB_USERNAME,
  DB_PASSWORD,
};
`;

module.exports = config;
