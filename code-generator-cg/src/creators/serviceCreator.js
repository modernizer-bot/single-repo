/**
 * @typedef {import("../types/cgIConfig").CgIConfig} CgIConfig
 * @typedef {import("../types/cgIConfig").CgITable} CgITable
 * @typedef {import("../types/cgIConfig").CgIView} CgIView
 * @typedef {import("../types/cgIConfig").CgISp} CgISp
 */
const path = require("path");
const { writeSignatureFile } = require("../helpers/writeSignatureFile");
const { deleteBy } = require("../constants/server/service/deleteBy");
const { execute } = require("../constants/server/service/execute");
const { insert } = require("../constants/server/service/insert");
const { selectAll } = require("../constants/server/service/selectAll");
const {
  selectByWithCount,
} = require("../constants/server/service/selectByWithCount");
const {
  selectByWithoutCount,
} = require("../constants/server/service/selectByWithoutCount");
const { service } = require("../constants/server/service/service");
const { updateBy } = require("../constants/server/service/updateBy");

/** @type {(cgIConfig: CgIConfig) => Promise<void|Error>} */
async function serviceCreator(cgIConfig) {
  const { tables, views, sp } = cgIConfig;
  for (const key in tables) {
    const table = tables[key];
    await writeSignatureFile(
      serializeTableFile(cgIConfig, table),
      path.join(cgIConfig.paths.services, table.fileName),
      cgIConfig
    );
  }
  for (const key in views) {
    const view = views[key];
    await writeSignatureFile(
      serializeViewFile(cgIConfig, view),
      path.join(cgIConfig.paths.services, view.fileName),
      cgIConfig
    );
  }
  for (const key in sp) {
    const spInstance = sp[key];
    await writeSignatureFile(
      serializeSpFile(cgIConfig, spInstance),
      path.join(cgIConfig.paths.services, spInstance.fileName),
      cgIConfig
    );
  }
}

/** @type {(cgIConfig: CgIConfig, table: CgITable) => string} */
function serializeTableFile(cgIConfig, table) {
  return service
    .replace("@@SIGNATURE@@", cgIConfig.signature)
    .replace(
      "@@RELATIVE_HELPER_PATH_FROM_SERVICE@@",
      cgIConfig.relativePaths.relativeHelperPathFromService
    )
    .replace("@@EXECUTE@@", "")
    .replace("@@INSERT@@", serializeInsertFunction(cgIConfig, table))
    .replace("@@SELECT_ALL@@", serializeSelectAllFunction(cgIConfig, table))
    .replace("@@SELECT_BY@@", serializeSelectByFunction(cgIConfig, table))
    .replace("@@UPDATE_BY@@", serializeUpdateByFunction(cgIConfig, table))
    .replace("@@DELETE_BY@@", serializeDeleteByFunction(cgIConfig, table));
}

/** @type {(cgIConfig: CgIConfig, table: CgITable) => string} */
function serializeTableServiceFunctionImports(cgIConfig, table) {
  const { getBy, putBy, deleteBy } = table;
  let tableServiceFunctionImports = [];
  if (table.insert) {
    tableServiceFunctionImports.push(table.serviceInsertFunctionName);
  }
  if (table.select) {
    tableServiceFunctionImports.push(table.serviceSelectFunctionName);
  }
  getBy.forEach((getByElement) => {
    tableServiceFunctionImports.push(getByElement.serviceFunctionName);
  });
  putBy.forEach((putByElement) => {
    tableServiceFunctionImports.push(putByElement.serviceFunctionName);
  });
  deleteBy.forEach((deleteByElement) => {
    tableServiceFunctionImports.push(deleteByElement.serviceFunctionName);
  });
  return tableServiceFunctionImports.join(",\n");
}

/** @type {(cgIConfig: CgIConfig, table: CgITable) => string} */
function serializeInsertFunction(cgIConfig, table) {
  if (table.insert) {
    return insert
      .replace("@@SERVICE_FUNCTION_NAME@@", table.serviceInsertFunctionName)
      .replace("@@SERVICE_FUNCTION_NAME@@", table.serviceInsertFunctionName)
      .replace("@@ENTITY_NAME@@", table.name);
  }
}
/** @type {(cgIConfig: CgIConfig, table: CgITable | CgIView) => string} */
function serializeSelectAllFunction(cgIConfig, table) {
  if (table.select) {
    return selectAll
      .replace("@@SERVICE_FUNCTION_NAME@@", table.serviceSelectFunctionName)
      .replace("@@SERVICE_FUNCTION_NAME@@", table.serviceSelectFunctionName)
      .replace("@@ENTITY_NAME@@", table.name)
      .replace("@@ENTITY_NAME@@", table.name);
  }
  return "";
}
/** @type {(cgIConfig: CgIConfig, table: CgITable | CgIView) => string} */
function serializeSelectByFunction(cgIConfig, table) {
  return table.getBy
    .map((getByElement) => {
      const selectBy = getByElement.count
        ? selectByWithCount
        : selectByWithoutCount;
      return selectBy
        .replace("@@SERVICE_FUNCTION_NAME@@", getByElement.serviceFunctionName)
        .replace("@@SERVICE_FUNCTION_NAME@@", getByElement.serviceFunctionName)
        .replace("@@ARGUMENTS@@", getByElement.arguments)
        .replace("@@ENTITY_NAME@@", table.name)
        .replace("@@ENTITY_NAME@@", table.name)
        .replace("@@WHERE@@", getByElement.whereString)
        .replace("@@WHERE@@", getByElement.whereString);
    })
    .join(";\n");
}
/** @type {(cgIConfig: CgIConfig, table: CgITable) => string} */
function serializeUpdateByFunction(cgIConfig, table) {
  return table.putBy
    .map((putByElement) =>
      updateBy
        .replace("@@SERVICE_FUNCTION_NAME@@", putByElement.serviceFunctionName)
        .replace("@@SERVICE_FUNCTION_NAME@@", putByElement.serviceFunctionName)
        .replace("@@ARGUMENTS@@", putByElement.arguments)
        .replace("@@ENTITY_NAME@@", table.name)
        .replace("@@WHERE@@", putByElement.whereString)
    )
    .join(";\n");
}

/** @type {(cgIConfig: CgIConfig, table: CgITable) => string} */
function serializeDeleteByFunction(cgIConfig, table) {
  return table.deleteBy
    .map((deleteByElement) =>
      deleteBy
        .replace(
          "@@SERVICE_FUNCTION_NAME@@",
          deleteByElement.serviceFunctionName
        )
        .replace(
          "@@SERVICE_FUNCTION_NAME@@",
          deleteByElement.serviceFunctionName
        )
        .replace("@@ARGUMENTS@@", deleteByElement.arguments)
        .replace("@@ENTITY_NAME@@", table.name)
        .replace("@@WHERE@@", deleteByElement.whereString)
    )
    .join(";\n");
}
/** @type {(cgIConfig: CgIConfig, view: CgIView) => string} */
function serializeViewFile(cgIConfig, view) {
  return service
    .replace("@@SIGNATURE@@", cgIConfig.signature)
    .replace(
      "@@RELATIVE_HELPER_PATH_FROM_SERVICE@@",
      cgIConfig.relativePaths.relativeHelperPathFromService
    )
    .replace("@@EXECUTE@@", "")
    .replace("@@INSERT@@", "")
    .replace("@@SELECT_ALL@@", serializeSelectAllFunction(cgIConfig, view))
    .replace("@@SELECT_BY@@", serializeSelectByFunction(cgIConfig, view))
    .replace("@@UPDATE_BY@@", "")
    .replace("@@DELETE_BY@@", "");
}

/** @type {(cgIConfig: CgIConfig, sp: CgISp) => string} */
function serializeSpFile(cgIConfig, sp) {
  return service
    .replace("@@SIGNATURE@@", cgIConfig.signature)
    .replace(
      "@@RELATIVE_HELPER_PATH_FROM_SERVICE@@",
      cgIConfig.relativePaths.relativeHelperPathFromService
    )
    .replace("@@EXECUTE@@", serializeExecuteFunction(cgIConfig, sp))
    .replace("@@INSERT@@", "")
    .replace("@@SELECT_ALL@@", "")
    .replace("@@SELECT_BY@@", "")
    .replace("@@UPDATE_BY@@", "")
    .replace("@@DELETE_BY@@", "");
}

/** @type {(cgIConfig: CgIConfig, sp: CgISp) => string} */
function serializeExecuteFunction(cgIConfig, sp) {
  return execute
    .replace("@@SERVICE_FUNCTION_NAME@@", sp.serviceExecuteFunctionName)
    .replace("@@SERVICE_FUNCTION_NAME@@", sp.serviceExecuteFunctionName)
    .replace("@@ARGUMENTS@@", sp.arguments)
    .replace("@@ENTITY_NAME@@", sp.name)
    .replace("@@PARAMETERS@@", sp.arguments)
    .replace("@@CALL@@", sp.call);
}
module.exports = { serviceCreator };
