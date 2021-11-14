const fs = require('fs');

fs.readFile("first",(err,data) => {
    if(err) {
        console.log({firstFileErr: err});
    }
    console.log(data.toString());
});

fs.readFile("second",(err,data) => {
    if(err) {
        console.log({secondFileErr: err});
    }
    console.log(data.toString());
});

fs.readFile("third",(err,data) => {
    if(err) {
        console.log({thirdFileErr: err});
    }
    console.log(data.toString());
});

console.log("main js code");
