const controller = `// AUTO GENERATE CODE DO NOT EDIT
const @@SERVICE_NAME@@ = require("@@PATH@@/@@SERVICE_FILE_NAME@@");
@@LOGGER_IMPORT@@

class @@CONTROLLER_CLASS_NAME@@ {
  @@POST@@
  @@GET_BY@@
  @@PUT_BY@@
  @@DELETE_BY@@
}

module.exports = @@CONTROLLER_CLASS_NAME@@;
`;

module.exports = controller;
