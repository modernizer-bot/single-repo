/**
 * @typedef {import("../types/index").ICgConfig} ICgConfig
 */
const { exec } = require("child_process");

/** @type {(iCgConfig:ICgConfig, filePath:string) => Promise<void | Error>} */
async function formatter(iCgConfig, filePath) {
  return new Promise((resolve, reject) => {
    exec(`${iCgConfig.formatter} ${filePath} --write`, (err, stdout, stderr) => {
      if (err) {
        console.log(`error: \n${err.message}`);
        reject(err);
        return;
      }
      if (stderr) {
        console.log(`stderr: \n${stderr}`);
        return;
      }
      console.log(`stdout: \n${stdout}`);
      resolve();
    });
  });
}

module.exports = { formatter };
