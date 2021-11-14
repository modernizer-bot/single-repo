const authImport = require("./authImport");
const autheMw = require("./autheMw");
const authoMw = require("./authoMw");
const deleteBy = require("./deleteBy");
const getBy = require("./getBy");
const indexRouter = require("./indexRouter");
const permissionImport = require("./permissionImport");
const post = require("./post");
const putBy = require("./putBy");
const router = require("./router");
const routerImport = require("./routerImport");

const serverRouter = {
  autheMw,
  authImport,
  authoMw,
  deleteBy,
  getBy,
  indexRouter,
  permissionImport,
  post,
  putBy,
  router,
  routerImport,
};

module.exports = serverRouter;
