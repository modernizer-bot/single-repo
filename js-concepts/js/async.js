const fs = require('fs').promises;
async function readFiles() {
    let data;
    data = await fs.readFile("first");
    console.log(data.toString());
    data = await fs.readFile("second");
    console.log(data.toString());
    data = await fs.readFile("third");
    console.log(data.toString());
}

readFiles();