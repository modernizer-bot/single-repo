const path = require("path");
const fs = require("fs").promises;
const config = require("./config");
const Formatter = require("./formatter");

async function writeFile(data, filePath, fileName) {
  const absoluteFilePath = path.join(config.projectRoot, filePath, fileName);
  console.log({ absoluteFilePath });
  await fs.writeFile(absoluteFilePath, data);
  Formatter.format(absoluteFilePath);
}

module.exports = writeFile;
