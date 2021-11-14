/**
 * @typedef {import("../types/cgConfig").CgConfig} CgConfig
 * @typedef {import("../types/cgConfig").CgSp} CgSp
 * @typedef {import("../types/cgIConfig").CgIConfig} CgIConfig
 * @typedef {import("../types/cgIConfig").CgISp} CgISp
 *
 */
const { snakeToCamel, snakeToPascal } = require("../helpers/transformName");

/** @type {(cgConfig:CgConfig) => {[key:string]:CgISp}} */
function spParser(cgConfig) {
  /** @type {{[key:string]:CgISp}} */
  const cgFunctionObject = {};
  for (const key in cgConfig.sp) {
    const spName = key;
    const cgSp = cgConfig.sp[key];
    const apiArguments = cgSp.parameters.join(",");
    cgFunctionObject[key] = {
      name: spName,
      entityName: `${snakeToCamel(spName)}`,
      fileName: `${snakeToCamel(spName)}.js`,
      importFileName: `${snakeToCamel(spName)}`,
      call: cgSp.call ? "true" : "",
      apiExecuteFunctionName: `${snakeToCamel(spName)}ApiExecute`,
      controllerExecuteFunctionName: `${snakeToCamel(spName)}ControllerExecute`,
      serviceExecuteFunctionName: `${snakeToCamel(spName)}ServiceExecute`,
      permissions: cgSp.permissions.join(", "),
      auth: cgSp.auth,
      logger: cgSp.logger,
      rest: cgSp.rest,
      baseUrl: `${snakeToCamel(spName)}`,
      arguments: apiArguments,
    };
  }
  return cgFunctionObject;
}

module.exports = { spParser };
