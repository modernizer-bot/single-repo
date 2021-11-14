const chalk = require("chalk");

/** @type {(queries:import("../..").Queries,conf:import("../..").Conf) => void} */
function validateSqlToCodeConfig(queries, conf) {
  if (!("appBaseUrl" in conf))
    throw new Error("propert appBaseUrl of conf is required");
  if (!("clientFilesPath" in conf))
    throw new Error("propert clientFilesPath of conf is required");
  if (!("dbDatabase" in conf))
    throw new Error("propert dbDatabase of conf is required");
  if (!("dbHost" in conf))
    throw new Error("propert dbHost of conf is required");
  if (!("dbPassword" in conf))
    throw new Error("propert dbPassword of conf is required");
  if (!("dbPort" in conf))
    throw new Error("propert dbPort of conf is required");
  if (!("dbUsername" in conf))
    throw new Error("propert dbUsername of conf is required");
  if (!("serverFilesPath" in conf))
    throw new Error("propert serverFilesPath of conf is required");
  for (const key in queries) {
    const queryItem = queries[key];
    if (!("identifiers" in queryItem && Array.isArray(queryItem.identifiers)))
      throw new Error(`propert identifiers of queries.${key} is required`);
    if (!("parameters" in queryItem && Array.isArray(queryItem.parameters)))
      throw new Error(`propert parameters of queries.${key} is required`);
    if (!("permissions" in queryItem && Array.isArray(queryItem.permissions)))
      throw new Error(`propert permissions of queries.${key} is required`);
    if (!("query" in queryItem && typeof queryItem.query === "string"))
      throw new Error(`propert query of queries.${key} is required and`);
  }
  console.log(
    chalk.green(`validateSqlToCodeConfig is PASSED, CONFIG is VALID`)
  );
}

module.exports = {
  validateSqlToCodeConfig,
};
