/**
 * @typedef {import("../types/cgConfig").CgConfig} CgConfig
 * @typedef {import("../types/cgConfig").CgView} CgView
 * @typedef {import("../types/cgIConfig").CgIConfig} CgIConfig
 * @typedef {import("../types/cgIConfig").CgIView} CgIView
 * @typedef {import("../types/cgIConfig").CgIViewGetBy} CgIViewGetBy
 *
 */
const {
  FIELD_SEPERATOR,
  OPERATOR_SEPERATOR,
  OPERATOR_TO_STRING,
} = require("../helpers/config");
const { snakeToCamel, snakeToPascal } = require("../helpers/transformName");
const {
  parseArgumentString,
  parseQueryString,
  parseFunctionName,
  parseUrlPath,
  parseWhereString,
} = require("./helpers");

/** @type {(cgConfig:CgConfig) => {[key:string]:CgIView}} */
function viewParser(cgConfig) {
  /** @type {{[key:string]:CgIView}} */
  const cgViewObject = {};
  for (const key in cgConfig.views) {
    const viewName = key;
    const cgView = cgConfig.views[key];
    cgViewObject[key] = {
      name: viewName,
      entityName: `${snakeToCamel(viewName)}`,
      fileName: `${snakeToCamel(viewName)}.js`,
      importFileName: `${snakeToCamel(viewName)}`,
      apiSelectFunctionName: `${snakeToCamel(viewName)}ApiGetAll`,
      controllerSelectFunctionName: `${snakeToCamel(viewName)}ControllerGetAll`,
      serviceSelectFunctionName: `${snakeToCamel(viewName)}ServiceSelectAll`,
      baseUrl: snakeToCamel(viewName),
      auth: cgView.auth,
      logger: cgView.logger,
      rest: cgView.rest,
      select: cgView.select,
      permissions: cgView.permissions.join(", "),
      getBy: getByParser(cgConfig, cgView, viewName),
    };
  }
  return cgViewObject;
}

/** @type {(cgConfig: CgConfig, cgView: CgView, viewName: string) => CgIViewGetBy[]} */
function getByParser(cgConfig, cgView, viewName) {
  return cgView.selectBy.map((selectBy) => {
    const [countString, ...whereStringArr] = selectBy.split(FIELD_SEPERATOR);
    const apiArguments = parseArgumentString(whereStringArr);
    const apiFunctionName = parseFunctionName(
      "ApiGetBy",
      viewName,
      whereStringArr
    );
    const controllerFunctionName = parseFunctionName(
      "ControllerGetBy",
      viewName,
      whereStringArr
    );
    const serviceFunctionName = parseFunctionName(
      "ServiceSelectBy",
      viewName,
      whereStringArr
    );
    const queryString = parseQueryString(whereStringArr);
    const whereString = parseWhereString(whereStringArr);
    const urlPath = parseUrlPath("getBy", whereStringArr);
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

module.exports = { viewParser };
