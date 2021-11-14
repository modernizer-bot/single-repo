/**
 * @typedef {import("../types/cgIConfig").CgIConfig} CgIConfig
 * @typedef {import("../types/cgIConfig").CgITable} CgITable
 * @typedef {import("../types/cgIConfig").CgIView} CgIView
 * @typedef {import("../types/cgIConfig").CgISp} CgISp
 */
const path = require("path");
const { writeSignatureFile } = require("../helpers/writeSignatureFile");
const { indexRouter } = require("../constants/server/indexRouter/indexRouter");
const {
  routerImport,
} = require("../constants/server/indexRouter/routerImport");

/** @type {(cgIConfig: CgIConfig) => Promise<void|Error>} */
async function indexRouterCreator(cgIConfig) {
  await writeSignatureFile(
    serializeAuthFile(cgIConfig),
    path.join(cgIConfig.paths.routers, cgIConfig.helpersFileNames.indexRouter),
    cgIConfig
  );
}

/** @type {(cgIConfig: CgIConfig) => string} */
function serializeAuthFile(cgIConfig) {
  return indexRouter
    .replace("@@SIGNATURE@@", cgIConfig.signature)
    .replace("@@IMPORT_ROUTERS@@", serializeRouterImport(cgIConfig));
}

/** @type {(cgIConfig: CgIConfig) => string} */
function serializeRouterImport(cgIConfig) {
  const routerImports = [];
  const { tables, views, sp } = cgIConfig;
  for (const key in tables) {
    const tableName = key;
    const table = tables[key];
    table.rest &&
      routerImports.push(
        routerImport
          .replace("@@BASE_URL@@", table.baseUrl)
          .replace(
            "@@IMPORT_FILE_NAME@@",
            table.fileName.slice(0, table.fileName.length - 3)
          )
      );
  }
  for (const key in views) {
    const viewName = key;
    const view = views[key];
    view.rest &&
      routerImports.push(
        routerImport
          .replace("@@BASE_URL@@", view.baseUrl)
          .replace(
            "@@IMPORT_FILE_NAME@@",
            view.fileName.slice(0, view.fileName.length - 3)
          )
      );
  }
  for (const key in sp) {
    const spName = key;
    const spInstance = sp[key];
    spInstance.rest &&
      routerImports.push(
        routerImport
          .replace("@@BASE_URL@@", spInstance.baseUrl)
          .replace(
            "@@IMPORT_FILE_NAME@@",
            spInstance.fileName.slice(0, spInstance.fileName.length - 3)
          )
      );
  }
  return routerImports.join(";\n");
}

module.exports = { indexRouterCreator };
