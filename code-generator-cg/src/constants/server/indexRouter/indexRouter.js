const indexRouter = `@@SIGNATURE@@
const express = require("express");
const router = express.Router();

@@IMPORT_ROUTERS@@

module.exports = { router };
`;

module.exports = { indexRouter };
