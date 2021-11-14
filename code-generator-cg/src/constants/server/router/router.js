const router = `@@SIGNATURE@@
const express = require("express");
const {@@CONTROLLER_FUNCTION_IMPORTS@@} = require("@@RELATIVE_CONTROLLER_PATH_FROM_ROUTER@@/@@CONTROLLER_FILE_NAME@@");

@@AUTH_IMPORT@@
@@PERMISSION_IMPORT@@
const router = express.Router();
@@AUTHENTICATION_MIDDLEWARE@@
@@AUTHORIZATION_MIDDLEWARE@@

@@EXECUTE_ROUTE@@
@@POST_ROUTE@@
@@GET_ALL_ROUTE@@
@@GET_BY_ROUTE@@
@@PUT_BY_ROUTE@@
@@DELETE_BY_ROUTE@@

module.exports = { router };
`;

module.exports = { router };
