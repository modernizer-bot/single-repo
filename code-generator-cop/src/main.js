/* eslint-disable no-async-promise-executor */
/* eslint-disable no-use-before-define */
/* eslint-disable import/no-dynamic-require */
const path = require("path");
const cleanFolders = require("./helpers/cleanFolders");
const config = require("./helpers/config");
const writeFile = require("./helpers/writeFile");
const ConfigParser = require("./helpers/parser");
const ApiCreator = require("./creators/apiCreator");
const ServiceCreator = require("./creators/serviceCreator");
const ControllerCreator = require("./creators/controllerCreator");
const RouterCreator = require("./creators/routerCreator");
const IndexRouterCreator = require("./creators/indexRouterCreator");
const HelperCreator = require("./creators/helperCreator");
const mainValidator = require("./validators");

const copConfig = require(path.join(config.projectRoot, "cop-config.json"));

async function main() {
  mainValidator(copConfig);
  cleanFolders(copConfig.options);
  let fileData;
  HelperCreator.writeData(copConfig.options);
  copConfig.entities.forEach(async (e) => {
    try {
      if (copConfig.options.createServices) {
        fileData = await ServiceCreator.fileData(e, copConfig.options.paths);
        await writeFile(fileData, copConfig.options.paths.services, ConfigParser.fileName(e));
      }
      if (e.rest) {
        if (copConfig.options.createApis) {
          fileData = await ApiCreator.fileData(e, copConfig.options.paths);
          await writeFile(fileData, copConfig.options.paths.apis, ConfigParser.fileName(e));
        }
        if (copConfig.options.createControllers) {
          fileData = await ControllerCreator.fileData(e, copConfig.options.paths);
          await writeFile(fileData, copConfig.options.paths.controllers, ConfigParser.fileName(e));
        }
        if (copConfig.options.createRouters) {
          fileData = await RouterCreator.fileData(e, copConfig.options.paths);
          await writeFile(fileData, copConfig.options.paths.routers, ConfigParser.fileName(e));
        }
      }
    } catch (err) {
      console.log({ err });
    }
  });
  if (copConfig.options.createRouters) {
    fileData = await IndexRouterCreator.fileData(copConfig.entities);
    await writeFile(fileData, copConfig.options.paths.routers, "index.js");
  }
}

main();
