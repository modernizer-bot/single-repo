const fs = require("fs");
const BUFFER_LENGTH = 8;
/** @type {() => boolean} */
function readCommandLine() {
  const stdin = fs.openSync("/dev/stdin", "rs");
  const buffer = Buffer.alloc(BUFFER_LENGTH);
  // @ts-ignore
  fs.readSync(stdin, buffer, 0, BUFFER_LENGTH);
  const prompt = buffer.toString();
  fs.closeSync(stdin);
  return prompt.toLowerCase().includes("y");
}

module.exports = { readCommandLine };
