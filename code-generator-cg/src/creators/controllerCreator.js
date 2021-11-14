/**
 * @typedef {import("../types/cgIConfig").CgIConfig} CgIConfig
 * @typedef {import("../types/cgIConfig").CgITable} CgITable
 * @typedef {import("../types/cgIConfig").CgIView} CgIView
 * @typedef {import("../types/cgIConfig").CgISp} CgISp
 */
const path = require("path");
const { writeSignatureFile } = require("../helpers/writeSignatureFile");
const { controller } = require("../constants/server/controller/controller");
const { deleteBy } = require("../constants/server/controller/deleteBy");
const { execute } = require("../constants/server/controller/execute");
const { getBy } = require("../constants/server/controller/getBy");
const { logger } = require("../constants/server/controller/logger");
const { loggerImport } = require("../constants/server/controller/loggerImport");
const { post } = require("../constants/server/controller/post");
const { putBy } = require("../constants/server/controller/putBy");
const { getAll } = require("../constants/server/controller/getAll");

/** @type {(cgIConfig: CgIConfig) => Promise<void|Error>} */
async function controllerCreator(cgIConfig) {
  const { tables, views, sp } = cgIConfig;
  for (const key in tables) {
    const table = tables[key];
    table.rest &&
      (await writeSignatureFile(
        serializeTableFile(cgIConfig, table),
        path.join(cgIConfig.paths.controllers, table.fileName),
        cgIConfig
      ));
  }
  for (const key in views) {
    const view = views[key];
    view.rest &&
      (await writeSignatureFile(
        serializeViewFile(cgIConfig, view),
        path.join(cgIConfig.paths.controllers, view.fileName),
        cgIConfig
      ));
  }
  for (const key in sp) {
    const spInstance = sp[key];
    spInstance.rest &&
      (await writeSignatureFile(
        serializeSpFile(cgIConfig, spInstance),
        path.join(cgIConfig.paths.controllers, spInstance.fileName),
        cgIConfig
      ));
  }
}

/** @type {(cgIConfig: CgIConfig, table: CgITable) => string} */
function serializeTableFile(cgIConfig, table) {
  return controller
    .replace("@@SIGNATURE@@", cgIConfig.signature)
    .replace(
      "@@RELATIVE_SERVICE_PATH_FROM_CONTROLLER@@",
      cgIConfig.relativePaths.relativeServicePathFromController
    )
    .replace(
      "@@SERVICE_FUNCTION_IMPORTS@@",
      serializeTableServiceFunctionImports(cgIConfig, table)
    )
    .replace("@@SERVICE_FILE_NAME@@", table.importFileName)
    .replace("@@LOGGER_IMPORT@@", serializeLoggerImport(cgIConfig, table))
    .replace("@@EXECUTE@@", "")
    .replace("@@POST@@", serializePostFunction(cgIConfig, table))
    .replace("@@GET_ALL@@", serializeGetAllFunction(cgIConfig, table))
    .replace("@@GET_BY@@", serializeGetByFunction(cgIConfig, table))
    .replace("@@PUT_BY@@", serializePutByFunction(cgIConfig, table))
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

/** @type {(cgIConfig: CgIConfig, table: CgITable | CgIView | CgISp) => string} */
function serializeLoggerImport(cgIConfig, table) {
  if (table.logger) {
    return loggerImport.replace(
      "@@RELATIVE_HELPER_PATH_FROM_CONTROLLER@@",
      cgIConfig.relativePaths.relativeHelperPathfromRouter
    );
  }
  return "";
}

/** @type {(cgIConfig: CgIConfig, table: CgITable) => string} */
function serializePostFunction(cgIConfig, table) {
  if (table.rest) {
    return post
      .replace(
        "@@CONTROLLER_FUNCTION_NAME@@",
        table.controllerInsertFunctionName
      )
      .replace(
        "@@CONTROLLER_FUNCTION_NAME@@",
        table.controllerInsertFunctionName
      )
      .replace("@@SERVICE_FUNCTION_NAME@@", table.serviceInsertFunctionName)
      .replace("@@LOGGER@@", serializeLogger(cgIConfig, table));
  }
}
/** @type {(cgIConfig: CgIConfig, table: CgITable | CgIView) => string} */
function serializeGetAllFunction(cgIConfig, table) {
  if (table.rest && table.select) {
    return getAll
      .replace(
        "@@CONTROLLER_FUNCTION_NAME@@",
        table.controllerSelectFunctionName
      )
      .replace(
        "@@CONTROLLER_FUNCTION_NAME@@",
        table.controllerSelectFunctionName
      )
      .replace("@@SERVICE_FUNCTION_NAME@@", table.serviceSelectFunctionName)
      .replace("@@LOGGER@@", serializeLogger(cgIConfig, table));
  }
  return "";
}
/** @type {(cgIConfig: CgIConfig, table: CgITable | CgIView) => string} */
function serializeGetByFunction(cgIConfig, table) {
  if (table.rest) {
    return table.getBy
      .map((getByElement) =>
        getBy
          .replace(
            "@@CONTROLLER_FUNCTION_NAME@@",
            getByElement.controllerFunctionName
          )
          .replace(
            "@@CONTROLLER_FUNCTION_NAME@@",
            getByElement.controllerFunctionName
          )
          .replace(
            "@@SERVICE_FUNCTION_NAME@@",
            getByElement.serviceFunctionName
          )
          .replace("@@LOGGER@@", serializeLogger(cgIConfig, table))
      )
      .join(";\n");
  }
  return "";
}
/** @type {(cgIConfig: CgIConfig, table: CgITable) => string} */
function serializePutByFunction(cgIConfig, table) {
  return table.putBy
    .map((putByElement) =>
      putBy
        .replace(
          "@@CONTROLLER_FUNCTION_NAME@@",
          putByElement.controllerFunctionName
        )
        .replace(
          "@@CONTROLLER_FUNCTION_NAME@@",
          putByElement.controllerFunctionName
        )
        .replace("@@SERVICE_FUNCTION_NAME@@", putByElement.serviceFunctionName)
        .replace("@@LOGGER@@", serializeLogger(cgIConfig, table))
    )
    .join(";\n");
}

/** @type {(cgIConfig: CgIConfig, talbe: CgITable | CgIView | CgISp) => string} */
function serializeLogger(cgIConfig, table) {
  if (table.logger) {
    return logger;
  }
  return "";
}
/** @type {(cgIConfig: CgIConfig, table: CgITable) => string} */
function serializeDeleteByFunction(cgIConfig, table) {
  if (table.rest) {
    return table.deleteBy
      .map((deleteByElement) =>
        deleteBy
          .replace(
            "@@CONTROLLER_FUNCTION_NAME@@",
            deleteByElement.controllerFunctionName
          )
          .replace(
            "@@CONTROLLER_FUNCTION_NAME@@",
            deleteByElement.controllerFunctionName
          )
          .replace(
            "@@SERVICE_FUNCTION_NAME@@",
            deleteByElement.serviceFunctionName
          )
          .replace("@@LOGGER@@", serializeLogger(cgIConfig, table))
      )
      .join(";\n");
  }
  return "";
}
/** @type {(cgIConfig: CgIConfig, view: CgIView) => string} */
function serializeViewFile(cgIConfig, view) {
  return controller
    .replace("@@SIGNATURE@@", cgIConfig.signature)
    .replace(
      "@@RELATIVE_SERVICE_PATH_FROM_CONTROLLER@@",
      cgIConfig.relativePaths.relativeServicePathFromController
    )
    .replace(
      "@@SERVICE_FUNCTION_IMPORTS@@",
      serializeViewServiceFunctionImports(cgIConfig, view)
    )
    .replace("@@SERVICE_FILE_NAME@@", view.importFileName)
    .replace("@@LOGGER_IMPORT@@", serializeLoggerImport(cgIConfig, view))
    .replace("@@EXECUTE@@", "")
    .replace("@@POST@@", "")
    .replace("@@GET_ALL@@", serializeGetAllFunction(cgIConfig, view))
    .replace("@@GET_BY@@", serializeGetByFunction(cgIConfig, view))
    .replace("@@PUT_BY@@", "")
    .replace("@@DELETE_BY@@", "");
}
/** @type {(cgIConfig: CgIConfig, view: CgIView) => string} */
function serializeViewServiceFunctionImports(cgIConfig, view) {
  const { getBy } = view;
  let viewServiceFunctionImports = [];
  if (view.select) {
    viewServiceFunctionImports.push(view.serviceSelectFunctionName);
  }
  getBy.forEach((getByElement) => {
    viewServiceFunctionImports.push(getByElement.serviceFunctionName);
  });
  return viewServiceFunctionImports.join(",\n");
}

/** @type {(cgIConfig: CgIConfig, sp: CgISp) => string} */
function serializeSpFile(cgIConfig, sp) {
  return controller
    .replace("@@SIGNATURE@@", cgIConfig.signature)
    .replace(
      "@@RELATIVE_SERVICE_PATH_FROM_CONTROLLER@@",
      cgIConfig.relativePaths.relativeServicePathFromController
    )
    .replace(
      "@@SERVICE_FUNCTION_IMPORTS@@",
      serializeSpServiceFunctionImports(cgIConfig, sp)
    )
    .replace("@@SERVICE_FILE_NAME@@", sp.importFileName)
    .replace("@@LOGGER_IMPORT@@", serializeLoggerImport(cgIConfig, sp))
    .replace("@@EXECUTE@@", serializeExecuteFunction(cgIConfig, sp))
    .replace("@@POST@@", "")
    .replace("@@GET_ALL@@", "")
    .replace("@@GET_BY@@", "")
    .replace("@@PUT_BY@@", "")
    .replace("@@DELETE_BY@@", "");
}
/** @type {(cgIConfig: CgIConfig, sp: CgISp) => string} */
function serializeSpServiceFunctionImports(cgIConfig, sp) {
  return sp.serviceExecuteFunctionName;
}

/** @type {(cgIConfig: CgIConfig, sp: CgISp) => string} */
function serializeExecuteFunction(cgIConfig, sp) {
  if (sp.rest) {
    return execute
      .replace("@@CONTROLLER_FUNCTION_NAME@@", sp.controllerExecuteFunctionName)
      .replace("@@CONTROLLER_FUNCTION_NAME@@", sp.controllerExecuteFunctionName)
      .replace("@@SERVICE_FUNCTION_NAME@@", sp.serviceExecuteFunctionName)
      .replace("@@LOGGER@@", serializeLogger(cgIConfig, sp));
  }
  return "";
}
module.exports = { controllerCreator };
