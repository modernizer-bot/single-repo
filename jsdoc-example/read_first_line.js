const fs = require('fs');
const readline = require('readline');

/** @type {(string) => Promise<string>} */
async function getFirstLine(pathToFile) {
  const readable = fs.createReadStream(pathToFile);
  const reader = readline.createInterface({ input: readable });
  const line = await new Promise((resolve) => {
    reader.on('line', (line) => {
      reader.close();
      resolve(line);
    });
  });
  readable.close();
  return line;
}

getFirstLine("./type_person.js").then(line => {
    console.log(line);
})