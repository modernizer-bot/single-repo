const fs = require("fs").promises;

fs.readFile("first")
  .then((data) => {
    console.log(data.toString());
  })
  .then((_) => {
    return fs.readFile("second");
  })
  .then((data) => {
    console.log(data.toString());
  })
  .then((_) => {
    return fs.readFile("third");
  })
  .then((data) => {
    console.log(data.toString());
  })
  .catch((err) => {
    console.log({ firstOrSecondOrThirdFileErr: err });
  });

console.log("main js code");
