var crypto = require("crypto");
/** @type {(content:string) => boolean} */
function checkHashOfContent(content) {
  const [hash, ...rest] = content.split("\n");
  const fileHash = hash.concat("\n");
  const contentHash = `// ${crypto
    .createHash("md5")
    .update(rest.join("\n"))
    .digest("hex")}\n`;
//   console.log({ fileHash, contentHash });
  return fileHash === contentHash;
}

module.exports = { checkHashOfContent };
