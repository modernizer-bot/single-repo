const { cgConfig } = require("../cg_config");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const app = express();
app.use(morgan("dev"));
app.use(cors());
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: false }));

app.use(require("./routers/selectAnyObjectByAnyColumnAnyOp").router);
app.use(require("./routers/selectUserByUsernameIlike").router);

app.listen(4000, () => {
  console.log(`Server is listening port: ${4000}`);
});
