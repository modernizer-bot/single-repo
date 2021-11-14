const service = `// AUTO GENERATE CODE DO NOT EDIT
const gres = require("@@PATH@@/gres");

class @@SERVICE_NAME@@ {
  @@EXECUTE@@
  @@INSERT@@
  @@SELECT_BY@@
  @@UPDATE_BY@@
  @@DELETE_BY@@
}

module.exports = @@SERVICE_NAME@@;
`;
module.exports = service;
