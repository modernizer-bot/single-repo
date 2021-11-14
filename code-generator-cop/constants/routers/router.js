const router = `// AUTO GENERATE CODE DO NOT EDIT
const express = require("express");
const @@CONTROLLER_CLASS_NAME@@ = require("@@PATH@@/@@CONTROLLER_FILE_NAME@@");
@@AUTH_IMPORT@@
@@PERMISSION_IMPORT@@
const router = express.Router();
@@AUTHENTICATION_MIDDLEWARE@@
@@AUTHORIZATION_MIDDLEWARE@@

@@POST_ROUTE@@
@@GET_BY_ROUTE@@
@@PUT_BY_ROUTE@@
@@DELETE_BY_ROUTE@@

module.exports = router;
`;

module.exports = router;
