/**
 * @typedef {import("../types/cgIConfig").CgIConfig} CgIConfig
 */
const path = require("path");
const fs = require("fs");
const { formatter } = require("./formatter");
const { readFirstLine } = require("./readFirstLine");
/**
 * @type {(data:string, filePath:string, iCpConfig: CgIConfig) => Promise<void>}
 */
async function writeSignatureFile(data, filePath, iCpConfig) {
  try {
    const signature = await readFirstLine(filePath);
    if (signature.startsWith(iCpConfig.signature)) {
      fs.writeFileSync(filePath, data);
      await formatter(iCpConfig, filePath);
    }
  } catch (err) {
    console.log({ writeSignatureFileErr: err.message });
    fs.writeFileSync(filePath, data);
    await formatter(iCpConfig, filePath);
  }
}

module.exports = { writeSignatureFile };
