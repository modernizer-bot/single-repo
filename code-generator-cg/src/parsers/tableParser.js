/**
 * @typedef {import("../types/cgConfig").CgConfig} CgConfig
 * @typedef {import("../types/cgConfig").CgTable} CgTable
 * @typedef {import("../types/cgIConfig").CgIConfig} CgIConfig
 * @typedef {import("../types/cgIConfig").CgITable} CgITable
 * @typedef {import("../types/cgIConfig").CgITableGetBy} CgITableGetBy
 * @typedef {import("../types/cgIConfig").CgITablePutBy} CgITablePutBy
 * @typedef {import("../types/cgIConfig").CgITableDeleteBy} CgITableDeleteBy
 */
const { capitalizeFirstLetter } = require("../helpers/capitilazeFirstLetter");
const {
  FIELD_SEPERATOR,
  OPERATOR_SEPERATOR,
  OPERATOR_TO_STRING,
} = require("../helpers/config");
const { snakeToCamel, snakeToPascal } = require("../helpers/transformName");
const { parseArgumentString, parseQueryString, parseFunctionName, parseUrlPath, parseWhereString } = require("./helpers");

/** @type {(cgConfig:CgConfig) => {[key:string]:CgITable}} */
function tableParser(cgConfig) {
  /** @type {{[key:string]:CgITable}} */
  const cgTableObject = {};
  for (const key in cgConfig.tables) {
    const tableName = key;
    const cgTable = cgConfig.tables[key];
    cgTableObject[key] = {
      name: tableName,
      entityName: `${snakeToCamel(tableName)}`,
      fileName: `${snakeToCamel(tableName)}.js`,
      importFileName: `${snakeToCamel(tableName)}`,
      apiInsertFunctionName: `${snakeToCamel(tableName)}ApiPost`,
      apiSelectFunctionName: `${snakeToCamel(tableName)}ApiGetAll`,
      controllerInsertFunctionName: `${snakeToCamel(tableName)}ControllerPost`,
      controllerSelectFunctionName: `${snakeToCamel(tableName)}ControllerGetAll`,
      serviceInsertFunctionName: `${snakeToCamel(tableName)}ServiceInsert`,
      serviceSelectFunctionName: `${snakeToCamel(tableName)}ServiceSelectAll`,
      baseUrl: snakeToCamel(tableName),
      auth: cgTable.auth,
      logger: cgTable.logger,
      rest: cgTable.rest,
      select: cgTable.select,
      insert: cgTable.insert,
      permissions: cgTable.permissions.join(", "),
      getBy: getByParser(cgConfig, cgTable, tableName),
      putBy: putByParser(cgConfig, cgTable, tableName),
      deleteBy: deleteByParser(cgConfig, cgTable, tableName),
    };
  }
  return cgTableObject;
}

/** @type {(cgConfig: CgConfig, cgTable: CgTable, tableName: string) => CgITableGetBy[]} */
function getByParser(cgConfig, cgTable, tableName) {
  return cgTable.selectBy.map((findBy) => {
    const [countString, ...whereStringArr] = findBy.split(FIELD_SEPERATOR);
    const apiArguments = parseArgumentString(whereStringArr);
    const queryString = parseQueryString(whereStringArr);
    const apiFunctionName = parseFunctionName("ApiGetBy",tableName,whereStringArr);
    const controllerFunctionName = parseFunctionName("ControllerGetBy",tableName,whereStringArr);;
    const serviceFunctionName = parseFunctionName("ServiceSelectBy",tableName,whereStringArr);;
    const whereString = parseWhereString(whereStringArr);
    const urlPath = parseUrlPath("getBy",whereStringArr);
    return {
      count: countString === "true",
      arguments: apiArguments,
      apiFunctionName,
      controllerFunctionName,
      serviceFunctionName,
      queryString,
      whereString,
      urlPath,
    };
  });
}

/** @type {(cgConfig: CgConfig, cgTable: CgTable, tableName: string) => CgITablePutBy[]} */
function putByParser(cgConfig, cgTable, tableName) {
  return cgTable.updateBy.map((updateBy) => {
    const whereStringArr = updateBy.split(FIELD_SEPERATOR);
    const apiArguments = parseArgumentString(whereStringArr);
    const apiFunctionName = parseFunctionName("ApiPutBy",tableName,whereStringArr);;
    const controllerFunctionName = parseFunctionName("ControllerPutBy",tableName,whereStringArr);;
    const serviceFunctionName = parseFunctionName("ServiceUpdateBy",tableName,whereStringArr);;
    const queryString = parseQueryString(whereStringArr);
    const whereString = parseWhereString(whereStringArr);
    const urlPath = parseUrlPath("putBy",whereStringArr);;
    return {
      arguments: apiArguments,
      apiFunctionName,
      controllerFunctionName,
      serviceFunctionName,
      queryString,
      whereString,
      urlPath,
    };
  });
}

/** @type {(cgConfig: CgConfig, cgTable: CgTable, tableName) => CgITableDeleteBy[]} */
function deleteByParser(cgConfig, cgTable, tableName) {
  return cgTable.updateBy.map((updateBy) => {
    const whereStringArr = updateBy.split(FIELD_SEPERATOR);
    const apiArguments = parseArgumentString(whereStringArr);
    const apiFunctionName = parseFunctionName("ApiDeleteBy",tableName,whereStringArr);
    const controllerFunctionName = parseFunctionName("ControllerDeleteBy",tableName,whereStringArr);;
    const serviceFunctionName = parseFunctionName("ServiceDeleteBy",tableName,whereStringArr);;
    const queryString = parseQueryString(whereStringArr);
    const whereString = parseWhereString(whereStringArr);
    const urlPath = parseUrlPath("deleteBy",whereStringArr);;
    return {
      arguments: apiArguments,
      apiFunctionName,
      controllerFunctionName,
      serviceFunctionName,
      queryString,
      whereString,
      urlPath,
    };
  });
}

module.exports = { tableParser };
