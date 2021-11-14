/**
 * @typedef {import("../types/index").ICgConfig} ICgConfig
 */
const fs = require("fs");
const path = require("path");
const { readFirstLine } = require("./readFirstLine");
/** @type {(iCgConfig: ICgConfig) => Promise<void>} */
async function deleteSignatureFile(iCgConfig) {
  for (const key in iCgConfig.paths) {
    const folderPath = iCgConfig.paths[key];
    const files = fs.readdirSync(folderPath);
    for (const fileName of files) {
      const filePath = path.join(folderPath, fileName);
      try {
        const signature = await readFirstLine(filePath);
        if (signature.startsWith(iCgConfig.signature)) {
          fs.unlinkSync(filePath);
        }
      } catch (err) {
        console.log({ deleteSignatureFileErr: err.message });
      }
    }
  }
}

module.exports = { deleteSignatureFile };
