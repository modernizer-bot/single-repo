const express = require("express");
const { Pool } = require("pg");
const format = require("pg-format");

const codeToSqlConfig = {
  conf: {
    dbHost: "localhost",
    dbPort: "5432",
    dbUsername: "postgres",
    dbPassword: "postgres",
    dbDatabase: "postgres",
    appBaseUrl: "http://localhost:4000/api/",
    serverFilesPath: "./server/routers",
    clientFilesPath: "./web/src/apis",
    PERMISSIONS: {
      WORKER: 1,
      SUPERVISOR: 10,
      EXECUTOR: 100,
      DIRECTOR: 1000,
      CEO: 10000,
    },
  },
  queries: {
    selectUserByUsernameIlike: {
      query:
        "Select * from t_sys_users where username ilike $1 ordery by %s %s offset $2 limit $3",
      identifiers: ["orderByColumn", "orderByDirection"],
      parameters: ["usernameIlike", "offset", "limit"],
      permissions: ["WORKER", "SUPERVISOR"],
    },
    selectAnyObjectByAnyColumnAndAnyOp: {
      query:
        "Select * from %s where %s %s $1 order by %s %s offset $2 limit $3",
      identifiers: [
        "object",
        "column",
        "operator",
        "orderByColumn",
        "orderByDirection",
      ],
      parameters: ["columnValue", "offset", "limit"],
      permissions: ["CEO"],
    },
  },
};
/** @type {import("pg").Pool} */
let pool;
async function postgresConnect() {
  pool = new Pool({
    host: codeToSqlConfig.conf.dbHost,
    database: codeToSqlConfig.conf.dbDatabase,
    password: codeToSqlConfig.conf.dbPassword,
    port: Number(codeToSqlConfig.conf.dbPassword),
    user: codeToSqlConfig.conf.dbUsername,
  });
}
/** @type {() => Promise<void>} */
async function testPostgresConn() {
  try {
    await pool.query("select now();");
    console.log("Connection has been established successfully.");
  } catch (err) {
    console.log("Unable to connect to the database:", err);
  }
}

/** @type {(text:string, identifiers: any[],parameters: any[]) => Promise<any[]>} */
async function postgresQuery(text, identifiers, parameters) {
  const { rows } = await pool.query(format(text, identifiers), parameters);
  return rows;
}

/** @type {() => Promise<void>} */
async function postgresClose() {
  try {
    await pool.end;
  } catch (err) {
    console.log("Unable to close connection to the database:", err);
  }
}

/** @type {express.Handler} */
function login(req, res) {}

/** @type {express.Handler} */
function authenticate(req, res) {}

/** @type {(permissionIds: number[]) => import("express").Handler} */
function authorize(permissionIds) {
  return (req, res, next) => {};
}

/** @type {express.Handler} */
function logout(req, res) {}

module.exports = {
  codeToSqlConfig,
  postgresConnect,
  testPostgresConn,
  postgresQuery,
  postgresClose,
  login,
  authenticate,
  authorize,
  logout,
};
