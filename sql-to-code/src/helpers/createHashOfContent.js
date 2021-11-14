var crypto = require("crypto");
function createHashOfContent(content) {
  const hash = crypto.createHash("md5").update(content).digest("hex");
  return `// ${hash}\n`;
}

module.exports = { createHashOfContent };
