const deleteBy = require("./deleteBy");
const execute = require("./execute");
const insert = require("./insert");
const selectByWithCount = require("./selectByWithCount");
const selectByWithoutCount = require("./selectByWithoutCount");

const service = require("./service");
const updateBy = require("./updateBy");

const serverService = {
  deleteBy,
  execute,
  insert,
  selectByWithCount,
  selectByWithoutCount,
  service,
  updateBy,
};
module.exports = serverService;
