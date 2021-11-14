const controller = require("./controller");
const deleteBy = require("./deleteBy");
const execute = require("./execute");
const getBy = require("./getBy");
const logger = require("./logger");
const loggerImport = require("./loggerImport");
const post = require("./post");
const putBy = require("./putBy");

const serverController = {
  controller,
  deleteBy,
  execute,
  getBy,
  logger,
  loggerImport,
  post,
  putBy,
};
module.exports = serverController;
