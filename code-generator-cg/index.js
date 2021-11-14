const { init } = require("./src/init");

init()
  .then((_) => {
    console.log("Code Generator finished successfully");
  })
  .catch((err) => {
    console.log(err)
    console.error(`Code Generator Error: ${err}`);
  });
