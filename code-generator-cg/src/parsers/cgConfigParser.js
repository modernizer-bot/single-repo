/**
 * @typedef {import("../types/cgConfig").CgConfig} CgConfig
 * @typedef {import("../types/cgIConfig").CgIConfig} CgIConfig
 */
const path = require("path");
const { signature } = require("../constants/common/signature");
const { tableParser } = require("./tableParser");
const { viewParser } = require("./viewParser");
const { spParser } = require("./spParser");
const { permissionParser } = require("./permissionParser");

/** @type {(cgConfig:CgConfig) => Promise<CgIConfig>} */
async function cgConfigParser(cgConfig) {
  /** @type {CgIConfig} */
  const iCgConfig = {
    signature,
    conn: cgConfig.conn,
    url: cgConfig.url,
    formatter: cgConfig.formatter,
    permissions: await permissionParser(cgConfig),
    paths: {
      apis: cgConfig.paths.apis,
      routers: cgConfig.paths.routers,
      controllers: cgConfig.paths.controllers,
      services: cgConfig.paths.services,
      helpers: cgConfig.paths.helpers,
    },
    helpersFileNames: {
      authController: "authC.js",
      authRouter: "authR.js",
      clientAuth: "auth.js",
      clientHelper: "helper.js",
      config: "config.js",
      gres: "gres.js",
      logger: "logger.js",
      permissions: "permissions.js",
      postgres: "postgres.js",
      indexRouter: "index.js"
    },
    relativePaths: {
      relativeHelperPathFromService: path.relative(
        cgConfig.paths.services,
        cgConfig.paths.helpers
      ),
      relativeControllerPathFromRouter: path.relative(
        cgConfig.paths.routers,
        cgConfig.paths.controllers
      ),
      relativeServicePathFromController: path.relative(
        cgConfig.paths.controllers,
        cgConfig.paths.services
      ),
      relativeHelperPathfromRouter: path.relative(
        cgConfig.paths.routers,
        cgConfig.paths.helpers
      ),
      relativeHelperPathFromController: path.relative(
        cgConfig.paths.controllers,
        cgConfig.paths.helpers
      ),
    },
    tables: tableParser(cgConfig),
    views: viewParser(cgConfig),
    sp: spParser(cgConfig),
  };
  return iCgConfig;
}

module.exports = { cgConfigParser };
