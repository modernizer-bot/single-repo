/**
 * @typedef {import("../types/cgIConfig").CgIConfig} CgIConfig
 * @typedef {import("../types/cgIConfig").CgITable} CgITable
 * @typedef {import("../types/cgIConfig").CgIView} CgIView
 * @typedef {import("../types/cgIConfig").CgISp} CgISp
 */
const path = require("path");
const { writeSignatureFile } = require("../helpers/writeSignatureFile");
const { auth } = require("../constants/client/apis/auth");
const { helper } = require("../constants/client/apis/helper");
const { api } = require("../constants/client/apis/api");
const { deleteBy } = require("../constants/client/apis/deleteBy");
const { execute } = require("../constants/client/apis/execute");
const { getAll } = require("../constants/client/apis/getAll");
const { getBy } = require("../constants/client/apis/getBy");
const { post } = require("../constants/client/apis/post");
const { putBy } = require("../constants/client/apis/putBy");

/** @type {(cgIConfig: CgIConfig) => Promise<void|Error>} */
async function apiCreator(cgIConfig) {
  await writeSignatureFile(
    serializeAuthFile(cgIConfig),
    path.join(cgIConfig.paths.apis, cgIConfig.helpersFileNames.clientAuth),
    cgIConfig
  );
  await writeSignatureFile(
    serializeHelperFile(cgIConfig),
    path.join(cgIConfig.paths.apis, cgIConfig.helpersFileNames.clientHelper),
    cgIConfig
  );

  for (const key in cgIConfig.tables) {
    const table = cgIConfig.tables[key];
    table.rest &&
      (await writeSignatureFile(
        serializeApiTable(cgIConfig, table),
        path.join(cgIConfig.paths.apis, table.fileName),
        cgIConfig
      ));
  }

  for (const key in cgIConfig.views) {
    const view = cgIConfig.views[key];
    view.rest &&
      (await writeSignatureFile(
        serializeApiView(cgIConfig, view),
        path.join(cgIConfig.paths.apis, view.fileName),
        cgIConfig
      ));
  }

  for (const key in cgIConfig.sp) {
    const sp = cgIConfig.sp[key];
    sp.rest &&
      (await writeSignatureFile(
        serializeApiSp(cgIConfig, sp),
        path.join(cgIConfig.paths.apis, sp.fileName),
        cgIConfig
      ));
  }
}

/** @type {(cgIConfig: CgIConfig) => string} */
function serializeAuthFile(cgIConfig) {
  return auth.replace("@@SIGNATURE@@", cgIConfig.signature);
}

/** @type {(cgIConfig: CgIConfig) => string} */
function serializeHelperFile(cgIConfig) {
  return helper
    .replace("@@SIGNATURE@@", cgIConfig.signature)
    .replace("@@URL@@", cgIConfig.url);
}

/** @type {(cgIConfig: CgIConfig,table: CgITable) => string} */
function serializeApiTable(cgIConfig, table) {
  return api
    .replace("@@SIGNATURE@@", cgIConfig.signature)
    .replace("@@POST@@", serializePost(cgIConfig, table))
    .replace("@@EXECUTE@@", "")
    .replace("@@GET_ALL@@", serializeGetAll(cgIConfig, table))
    .replace("@@GET_BY@@", serializeGetBy(cgIConfig, table))
    .replace("@@PUT_BY@@", serializePutBy(cgIConfig, table))
    .replace("@@DELETE_BY@@", serializeDeleteBy(cgIConfig, table));
}

/** @type {(cgIConfig: CgIConfig,table: CgITable) => string} */
function serializePost(cgIConfig, table) {
  if (table.insert) {
    return post
      .replace("@@API_FUNCTION_NAME@@", table.apiInsertFunctionName)
      .replace("@@BASE_URL@@", table.baseUrl);
  }
  return "";
}

/** @type {(cgIConfig: CgIConfig,table: CgITable | CgIView) => string} */
function serializeGetAll(cgIConfig, table) {
  if (table.select) {
    return getAll
      .replace("@@API_FUNCTION_NAME@@", table.apiSelectFunctionName)
      .replace("@@BASE_URL@@", table.baseUrl);
  }
  return "";
}

/** @type {(cgIConfig: CgIConfig,table: CgITable | CgIView) => string} */
function serializeGetBy(cgIConfig, table) {
  let getByString = "";
  for (const getByElement of table.getBy) {
    getByString += getBy
      .replace("@@API_FUNCTION_NAME@@", getByElement.apiFunctionName)
      .replace("@@ARGUMENTS@@", getByElement.arguments)
      .replace("@@QUERY_STRING@@", getByElement.queryString)
      .replace("@@URL_PATH@@", getByElement.urlPath)
      .replace("@@BASE_URL@@", table.baseUrl);
  }
  return getByString;
}

/** @type {(cgIConfig: CgIConfig,table: CgITable) => string} */
function serializePutBy(cgIConfig, table) {
  let putByString = "";
  for (const putByElement of table.putBy) {
    putByString += putBy
      .replace("@@API_FUNCTION_NAME@@", putByElement.apiFunctionName)
      .replace("@@ARGUMENTS@@", putByElement.arguments)
      .replace("@@QUERY_STRING@@", putByElement.queryString)
      .replace("@@URL_PATH@@", putByElement.urlPath)
      .replace("@@BASE_URL@@", table.baseUrl);
  }
  return putByString;
}

/** @type {(cgIConfig: CgIConfig,table: CgITable) => string} */
function serializeDeleteBy(cgIConfig, table) {
  let deleteByString = "";
  for (const deleteByElement of table.deleteBy) {
    deleteByString += deleteBy
      .replace("@@API_FUNCTION_NAME@@", deleteByElement.apiFunctionName)
      .replace("@@ARGUMENTS@@", deleteByElement.arguments)
      .replace("@@QUERY_STRING@@", deleteByElement.queryString)
      .replace("@@URL_PATH@@", deleteByElement.urlPath)
      .replace("@@BASE_URL@@", table.baseUrl);
  }
  return deleteByString;
}

/** @type {(cgIConfig: CgIConfig,table: CgIView) => string} */
function serializeApiView(cgIConfig, view) {
  return api
    .replace("@@SIGNATURE@@", cgIConfig.signature)
    .replace("@@POST@@", "")
    .replace("@@EXECUTE@@", "")
    .replace("@@GET_ALL@@", serializeGetAll(cgIConfig, view))
    .replace("@@GET_BY@@", serializeGetBy(cgIConfig, view))
    .replace("@@PUT_BY@@", "")
    .replace("@@DELETE_BY@@", "");
}
/** @type {(cgIConfig: CgIConfig,table: CgISp) => string} */
function serializeApiSp(cgIConfig, sp) {
  return api
    .replace("@@SIGNATURE@@", cgIConfig.signature)
    .replace("@@POST@@", "")
    .replace("@@EXECUTE@@", serializeExecute(cgIConfig, sp))
    .replace("@@GET_ALL@@", "")
    .replace("@@GET_BY@@", "")
    .replace("@@PUT_BY@@", "")
    .replace("@@DELETE_BY@@", "");
}

/** @type {(cgIConfig: CgIConfig,table: CgISp) => string} */
function serializeExecute(cgIConfig, sp) {
  return execute
    .replace("@@API_FUNCTION_NAME@@", sp.apiExecuteFunctionName)
    .replace("@@ARGUMENTS@@", sp.arguments)
    .replace("@@ARGUMENTS@@", sp.arguments)
    .replace("@@BASE_URL@@", sp.baseUrl);
}

module.exports = { apiCreator };
