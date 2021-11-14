/**
 * @typedef {import("../types/cgIConfig").CgIConfig} CgIConfig
 */
const path = require("path");
const { authC } = require("../constants/server/helpers/authC");
const { authR } = require("../constants/server/helpers/authR");
const { config } = require("../constants/server/helpers/config");
const { gres } = require("../constants/server/helpers/gres");
const { logger } = require("../constants/server/helpers/logger");
const { permissions } = require("../constants/server/helpers/permissions");
const { postgres } = require("../constants/server/helpers/postgres");
const { writeSignatureFile } = require("../helpers/writeSignatureFile");
/** @type {(iCgConfig: CgIConfig) => Promise<void|Error>} */
async function helperCreator(cgIConfig) {
  await writeSignatureFile(
    serializeHelperFiles(cgIConfig, authC),
    path.join(cgIConfig.paths.helpers, cgIConfig.helpersFileNames.authController),
    cgIConfig
  );

  await writeSignatureFile(
    serializeHelperFiles(cgIConfig, authR),
    path.join(cgIConfig.paths.helpers, cgIConfig.helpersFileNames.authRouter),
    cgIConfig
  );

  await writeSignatureFile(
    serializeHelperFiles(cgIConfig, config),
    path.join(cgIConfig.paths.helpers, cgIConfig.helpersFileNames.config),
    cgIConfig
  );

  await writeSignatureFile(
    serializeHelperFiles(cgIConfig, gres),
    path.join(cgIConfig.paths.helpers, cgIConfig.helpersFileNames.gres),
    cgIConfig
  );

  await writeSignatureFile(
    serializeHelperFiles(cgIConfig, logger),
    path.join(cgIConfig.paths.helpers, cgIConfig.helpersFileNames.logger),
    cgIConfig
  );
  
    await writeSignatureFile(
      serializePermissionFile(cgIConfig),
      path.join(cgIConfig.paths.helpers, cgIConfig.helpersFileNames.permissions),
      cgIConfig
    );
  
  await writeSignatureFile(
    serializeHelperFiles(cgIConfig, postgres),
    path.join(cgIConfig.paths.helpers, cgIConfig.helpersFileNames.postgres),
    cgIConfig
  );
}

/** @type {(cgIConfig: CgIConfig, template:string) => string} */
function serializeHelperFiles(cgIConfig, template) {
  return template.replace("@@SIGNATURE@@", cgIConfig.signature);
}

/** @type {(cgIConfig: CgIConfig) => string} */
function serializePermissionFile(cgIConfig) {
  return permissions
    .replace("@@SIGNATURE@@", cgIConfig.signature)
    .replace("@@PERMISSIONS@@", cgIConfig.permissions);
}

module.exports = { helperCreator };
