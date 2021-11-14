const deleteBy = require("./deleteBy");
const execute = require("./execute");
const getBy = require("./getBy");
const post = require("./post");
const putBy = require("./putBy");
const service = require("./service");
const { helper } = require("./helper");

const clientService = {
  execute,
  post,
  deleteBy,
  getBy,
  putBy,
  service,
  helper,
};

module.exports = clientService;
