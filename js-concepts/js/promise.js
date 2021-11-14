const fs = require('fs').promises;

fs.readFile("first").then((data) => {
    console.log(data.toString());
}).catch((err) => {
    console.log({firstFileErr: err});
})

fs.readFile("second").then((data) => {
    console.log(data.toString());
}).catch((err) => {
    console.log({secondFileErr: err});
});

fs.readFile("third").then((data) => {
    console.log(data.toString());
}).catch((err) => {
    console.log({thirdFileErr: err});
});

console.log("main js code");
