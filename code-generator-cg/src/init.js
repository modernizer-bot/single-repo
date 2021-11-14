const { readCgConfig } = require("./helpers/readCgConfig");
const { cgConfigParser } = require("./parsers/cgConfigParser");
const { apiCreator } = require("./creators/apiCreator");
const {
  createFoldersIfNotExist,
} = require("./helpers/createFoldersIfNotExist");
const { deleteSignatureFile } = require("./helpers/deleteSignatureFile");
const { helperCreator } = require("./creators/helperCreator");
const { connect, end } = require("./helpers/postgres");
const { indexRouterCreator } = require("./creators/indexRouterCreator");
const { routerCreator } = require("./creators/routerCreator");
const { controllerCreator } = require("./creators/controllerCreator");
const { serviceCreator } = require("./creators/serviceCreator");
/** @type {() => Promise<void>} */
async function init() {
  const cgConfig = readCgConfig();
  connect(cgConfig.conn);
  const cgIConfig = await cgConfigParser(cgConfig);
  console.log(JSON.stringify(cgIConfig, null, 4));
  createFoldersIfNotExist(cgIConfig);
  await deleteSignatureFile(cgIConfig);
  await apiCreator(cgIConfig);
  await helperCreator(cgIConfig);
  await indexRouterCreator(cgIConfig);
  await routerCreator(cgIConfig);
  await controllerCreator(cgIConfig);
  await serviceCreator(cgIConfig);
  end();
}

module.exports = { init };
