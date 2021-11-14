const path = require("path");

let paths = {};

function setPaths(paramPaths) {
  paths = paramPaths;
}

function getRelativePath({ source = "", target = "", part = "server" }) {
  return path.relative(paths[part][source], paths[part][target]);
}
const pathUtils = {
  setPaths,
  getRelativePath,
};

module.exports = pathUtils;
