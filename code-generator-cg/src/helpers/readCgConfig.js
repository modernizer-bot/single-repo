/**
 * @typedef {import("../types/cgConfig").CgConfig} CgConfig
 */
const path = require('path');
const { CG_CONFIG_FILE_PATH, CG_CONFIG_FILE_NAME } = require('./config');

const cgConfigFilePath = path.join(CG_CONFIG_FILE_PATH, CG_CONFIG_FILE_NAME);

/** @type {CgConfig} */
// eslint-disable-next-line import/no-dynamic-require
const cgConfig = require(cgConfigFilePath);

/** @type {() => CgConfig} */
function readCgConfig() {
  return cgConfig;
}
module.exports = { readCgConfig };
