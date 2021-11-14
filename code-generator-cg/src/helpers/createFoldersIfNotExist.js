/** @typedef {import("../types/index").ICgConfig} ICgConfig */
const fs = require("fs");
/** @type {(iCgConfig: ICgConfig) => void} */
function createFoldersIfNotExist(iCgConfig) {
  for (const key in iCgConfig.paths) {
    if (!fs.existsSync(iCgConfig.paths[key])) {
      fs.mkdirSync(iCgConfig.paths[key], { recursive: true });
    }
  }
}

module.exports = { createFoldersIfNotExist };
