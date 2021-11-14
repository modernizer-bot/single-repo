const controller = `@@SIGNATURE@@
const {@@SERVICE_FUNCTION_IMPORTS@@} = require("@@RELATIVE_SERVICE_PATH_FROM_CONTROLLER@@/@@SERVICE_FILE_NAME@@");
@@LOGGER_IMPORT@@

@@EXECUTE@@
@@POST@@
@@GET_ALL@@
@@GET_BY@@
@@PUT_BY@@
@@DELETE_BY@@
`;

module.exports = { controller };
