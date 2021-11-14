/**
 * @typedef {import("../types/cgIConfig").CgIConfig} CgIConfig
 * @typedef {import("../types/cgIConfig").CgITable} CgITable
 * @typedef {import("../types/cgIConfig").CgIView} CgIView
 * @typedef {import("../types/cgIConfig").CgISp} CgISp
 */
const path = require("path");
const { writeSignatureFile } = require("../helpers/writeSignatureFile");
const { router } = require("../constants/server/router/router");
const { authImport } = require("../constants/server/router/authImport");
const { autheMw } = require("../constants/server/router/autheMw");
const { authoMw } = require("../constants/server/router/authoMw");
const { deleteBy } = require("../constants/server/router/deleteBy");
const { getBy } = require("../constants/server/router/getBy");
const {
  permissionImport,
} = require("../constants/server/router/permissionImport");
const { post } = require("../constants/server/router/post");
const { getAll } = require("../constants/server/router/getAll");
const { putBy } = require("../constants/server/router/putBy");
const { execute } = require("../constants/server/router/execute");

/** @type {(cgIConfig: CgIConfig) => Promise<void|Error>} */
async function routerCreator(cgIConfig) {
  const { tables, views, sp } = cgIConfig;
  for (const key in tables) {
    const table = tables[key];
    table.rest &&
      (await writeSignatureFile(
        serializeTableFile(cgIConfig, table),
        path.join(cgIConfig.paths.routers, table.fileName),
        cgIConfig
      ));
  }
  for (const key in views) {
    const view = views[key];
    view.rest &&
      (await writeSignatureFile(
        serializeViewFile(cgIConfig, view),
        path.join(cgIConfig.paths.routers, view.fileName),
        cgIConfig
      ));
  }
  for (const key in sp) {
    const spInstance = sp[key];
    spInstance.rest &&
      (await writeSignatureFile(
        serializeSpFile(cgIConfig, spInstance),
        path.join(cgIConfig.paths.routers, spInstance.fileName),
        cgIConfig
      ));
  }
}

/** @type {(cgIConfig: CgIConfig, table: CgITable) => string} */
function serializeTableFile(cgIConfig, table) {
  return router
    .replace("@@SIGNATURE@@", cgIConfig.signature)
    .replace(
      "@@RELATIVE_CONTROLLER_PATH_FROM_ROUTER@@",
      cgIConfig.relativePaths.relativeControllerPathFromRouter
    )
    .replace(
      "@@CONTROLLER_FUNCTION_IMPORTS@@",
      serializeTableControllerFunctionImports(cgIConfig, table)
    )
    .replace("@@CONTROLLER_FILE_NAME@@", table.importFileName)
    .replace("@@AUTH_IMPORT@@", serializeAuthImport(cgIConfig, table))
    .replace(
      "@@PERMISSION_IMPORT@@",
      serializePermissionImport(cgIConfig, table)
    )
    .replace(
      "@@AUTHENTICATION_MIDDLEWARE@@",
      serializeAutheMw(cgIConfig, table)
    )
    .replace("@@AUTHORIZATION_MIDDLEWARE@@", serializeAuthoMw(cgIConfig, table))
    .replace("@@EXECUTE_ROUTE@@", "")
    .replace("@@POST_ROUTE@@", serializeTablePostRoute(cgIConfig, table))
    .replace("@@GET_ALL_ROUTE@@", serializeGetAllRoute(cgIConfig, table))
    .replace("@@GET_BY_ROUTE@@", serializeGetByRoute(cgIConfig, table))
    .replace("@@PUT_BY_ROUTE@@", serializePutByRoute(cgIConfig, table))
    .replace("@@DELETE_BY_ROUTE@@", serializeDeleteByRoute(cgIConfig, table));
}

/** @type {(cgIConfig: CgIConfig, table: CgITable) => string} */
function serializeTableControllerFunctionImports(cgIConfig, table) {
  const { getBy, putBy, deleteBy } = table;
  let tableControllerFunctionImports = [];
  if (table.insert) {
    tableControllerFunctionImports.push(table.controllerInsertFunctionName);
  }
  if (table.select) {
    tableControllerFunctionImports.push(table.controllerSelectFunctionName);
  }
  getBy.forEach((getByElement) => {
    tableControllerFunctionImports.push(getByElement.controllerFunctionName);
  });
  putBy.forEach((putByElement) => {
    tableControllerFunctionImports.push(putByElement.controllerFunctionName);
  });
  deleteBy.forEach((deleteByElement) => {
    tableControllerFunctionImports.push(deleteByElement.controllerFunctionName);
  });
  return tableControllerFunctionImports.join(",\n");
}

/** @type {(cgIConfig: CgIConfig, table: CgITable | CgIView | CgISp) => string} */
function serializeAuthImport(cgIConfig, table) {
  if (table.auth) {
    return authImport.replace(
      "@@RELATIVE_HELPER_PATH_FROM_ROUTER@@",
      cgIConfig.relativePaths.relativeHelperPathfromRouter
    );
  }
  return "";
}

/** @type {(cgIConfig: CgIConfig, table: CgITable | CgIView | CgISp) => string} */
function serializePermissionImport(cgIConfig, table) {
  if (table.auth) {
    return permissionImport
      .replace(
        "@@RELATIVE_HELPER_PATH_FROM_ROUTER@@",
        cgIConfig.relativePaths.relativeHelperPathfromRouter
      )
      .replace("@@PERMISSIONS@@", table.permissions);
  }
  return "";
}

/** @type {(cgIConfig: CgIConfig, table: CgITable | CgIView | CgISp) => string} */
function serializeAutheMw(cgIConfig, table) {
  if (table.auth) {
    return autheMw;
  }
  return "";
}
/** @type {(cgIConfig: CgIConfig, table: CgITable | CgIView | CgISp) => string} */
function serializeAuthoMw(cgIConfig, table) {
  if (table.auth) {
    return authoMw.replace("@@PERMISSIONS@@", table.permissions);
  }
  return "";
}
/** @type {(cgIConfig: CgIConfig, table: CgITable) => string} */
function serializeTablePostRoute(cgIConfig, table) {
  if (table.rest && table.insert) {
    return post.replace(
      "@@CONTROLLER_FUNCTION_NAME@@",
      table.controllerInsertFunctionName
    );
  }
  return "";
}
/** @type {(cgIConfig: CgIConfig, table: CgITable | CgIView) => string} */
function serializeGetAllRoute(cgIConfig, table) {
  if (table.rest && table.select) {
    return getAll.replace(
      "@@CONTROLLER_FUNCTION_NAME@@",
      table.controllerSelectFunctionName
    );
  }
  return "";
}
/** @type {(cgIConfig: CgIConfig, table: CgITable | CgIView) => string} */
function serializeGetByRoute(cgIConfig, table) {
  if (table.rest) {
    return table.getBy
      .map((getByElement) =>
        getBy
          .replace("@@URL_PATH@@", getByElement.urlPath)
          .replace(
            "@@CONTROLLER_FUNCTION_NAME@@",
            getByElement.controllerFunctionName
          )
      )
      .join(";\n");
  }
  return "";
}
/** @type {(cgIConfig: CgIConfig, table: CgITable) => string} */
function serializePutByRoute(cgIConfig, table) {
  if (table.rest) {
    return table.putBy
      .map((putByElement) =>
        putBy
          .replace("@@URL_PATH@@", putByElement.urlPath)
          .replace(
            "@@CONTROLLER_FUNCTION_NAME@@",
            putByElement.controllerFunctionName
          )
      )
      .join(";\n");
  }
  return "";
}
/** @type {(cgIConfig: CgIConfig, table: CgITable) => string} */
function serializeDeleteByRoute(cgIConfig, table) {
  if (table.rest) {
    return table.deleteBy
      .map((deleteByElement) =>
        deleteBy
          .replace("@@URL_PATH@@", deleteByElement.urlPath)
          .replace(
            "@@CONTROLLER_FUNCTION_NAME@@",
            deleteByElement.controllerFunctionName
          )
      )
      .join(";\n");
  }
  return "";
}
/** @type {(cgIConfig: CgIConfig, view: CgIView) => string} */
function serializeViewFile(cgIConfig, view) {
  return router
    .replace("@@SIGNATURE@@", cgIConfig.signature)
    .replace(
      "@@RELATIVE_CONTROLLER_PATH_FROM_ROUTER@@",
      cgIConfig.relativePaths.relativeControllerPathFromRouter
    )
    .replace(
      "@@CONTROLLER_FUNCTION_IMPORTS@@",
      serializeViewControllerFunctionImports(cgIConfig, view)
    )
    .replace("@@CONTROLLER_FILE_NAME@@", view.importFileName)
    .replace(
      "@@AUTH_IMPORT@@",
      view.auth ? serializeAuthImport(cgIConfig, view) : ""
    )
    .replace(
      "@@PERMISSION_IMPORT@@",
      view.auth ? serializePermissionImport(cgIConfig, view) : ""
    )
    .replace("@@AUTHENTICATION_MIDDLEWARE@@", view.auth ? autheMw : "")
    .replace(
      "@@AUTHORIZATION_MIDDLEWARE@@",
      view.auth ? serializeAuthoMw(cgIConfig, view) : ""
    )
    .replace("@@EXECUTE_ROUTE@@", "")
    .replace("@@POST_ROUTE@@", "")
    .replace("@@GET_ALL_ROUTE@@", serializeGetAllRoute(cgIConfig, view))
    .replace("@@GET_BY_ROUTE@@", serializeGetByRoute(cgIConfig, view))
    .replace("@@PUT_BY_ROUTE@@", "")
    .replace("@@DELETE_BY_ROUTE@@", "");
}
/** @type {(cgIConfig: CgIConfig, view: CgIView) => string} */
function serializeViewControllerFunctionImports(cgIConfig, view) {
  const { getBy } = view;
  let viewControllerFunctionImports = [];
  if (view.select) {
    viewControllerFunctionImports.push(view.controllerSelectFunctionName);
  }
  getBy.forEach((getByElement) => {
    viewControllerFunctionImports.push(getByElement.controllerFunctionName);
  });
  return viewControllerFunctionImports.join(",\n");
}

/** @type {(cgIConfig: CgIConfig, sp: CgISp) => string} */
function serializeSpFile(cgIConfig, sp) {
  return router
    .replace("@@SIGNATURE@@", cgIConfig.signature)
    .replace(
      "@@RELATIVE_CONTROLLER_PATH_FROM_ROUTER@@",
      cgIConfig.relativePaths.relativeControllerPathFromRouter
    )
    .replace(
      "@@CONTROLLER_FUNCTION_IMPORTS@@",
      serializeSpControllerFunctionImports(cgIConfig, sp)
    )
    .replace(
      "@@CONTROLLER_FILE_NAME@@",
      sp.fileName.slice(0, sp.fileName.length - 3)
    )
    .replace("@@AUTH_IMPORT@@", serializeAuthImport(cgIConfig, sp))
    .replace("@@PERMISSION_IMPORT@@", serializePermissionImport(cgIConfig, sp))
    .replace("@@AUTHENTICATION_MIDDLEWARE@@", serializeAutheMw(cgIConfig, sp))
    .replace("@@AUTHORIZATION_MIDDLEWARE@@", serializeAuthoMw(cgIConfig, sp))
    .replace("@@EXECUTE_ROUTE@@", serializeExecuteRoute(cgIConfig, sp))
    .replace("@@POST_ROUTE@@", "")
    .replace("@@GET_ALL_ROUTE@@", "")
    .replace("@@GET_BY_ROUTE@@", "")
    .replace("@@PUT_BY_ROUTE@@", "")
    .replace("@@DELETE_BY_ROUTE@@", "");
}

/** @type {(cgIConfig: CgIConfig, sp: CgISp) => string} */
function serializeSpControllerFunctionImports(cgIConfig, sp) {
  return sp.controllerExecuteFunctionName;
}

/** @type {(cgIConfig: CgIConfig, sp: CgISp) => string} */
function serializeExecuteRoute(cgIConfig, sp) {
  if (sp.rest) {
    return execute.replace(
      "@@CONTROLLER_FUNCTION_NAME@@",
      sp.controllerExecuteFunctionName
    );
  }
  return "";
}

module.exports = { routerCreator };
