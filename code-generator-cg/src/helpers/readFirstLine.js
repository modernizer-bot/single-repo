const fs = require("fs");
const readline = require("readline");

/** @type {(string) => Promise<string>} */
async function readFirstLine(filePath) {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(filePath)) {
      const readable = fs.createReadStream(filePath);
      const reader = readline.createInterface({ input: readable });
      reader.on("line", (line) => {
        reader.close();
        readable.close();
        resolve(line);
      });
    } else {
      reject(new Error("File does not exist"));
    }
  });
}

module.exports = { readFirstLine };
