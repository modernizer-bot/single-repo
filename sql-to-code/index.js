const chalk = require("chalk");
const path = require("path");
const { createApis } = require("./src/creators/apisCreator");
const { createRouters } = require("./src/creators/routerCreator");
const {
  validateSqlToCodeConfig,
} = require("./src/helpers/validateSqlToCodeConfig");

/**
 * @typedef {{
 *   dbHost: string;
 *   dbPort: string;
 *   dbUsername: string;
 *   dbPassword: string;
 *   dbDatabase: string;
 *   appBaseUrl: string;
 *   serverFilesPath: string;
 *   clientFilesPath: string;
 * }} Conf;
 *
 * @typedef {{
 *   [key:string]:{
 *     query: string;
 *     identifiers: string[];
 *     parameters: string[];
 *     permissions?: string[];
 *   }
 * }} Queries
 * */

/** @type {{conf:Conf;queries:Queries}} */
const { conf, queries } = require(path.join(
  process.cwd(),
  "sql_to_code_config"
)).codeToSqlConfig;
(async () => {
  try {
    validateSqlToCodeConfig(queries, conf);
    await createRouters(queries, conf);
    await createApis(queries, conf);
  } catch (err) {
    console.log(chalk.red(err.message));
  }
})();
