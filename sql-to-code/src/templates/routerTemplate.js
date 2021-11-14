const routerTemplate = `const express = require("express");
const {
  postgresQuery,
  authenticate,
  authorize,
  codeToSqlConfig: {
    conf: {
      PERMISSIONS: { @@PERMISSIONS@@ },
    },
  },
} = require("@@SQL_TO_CODE_CONFIG_PATH@@/sql_to_code_config");
const router = express.Router();
router.use(authenticate);
router.use(authorize([@@PERMISSIONS@@]));
router.post("/api/@@ROUTER_PATH@@", @@CONTROLLER_FUNCTION_NAME@@);
/** @type {import("express").Handler} */
async function @@CONTROLLER_FUNCTION_NAME@@(req, res) {
  try {
    const { @@IDENTIFIERS_AND_PARAMETERS@@ } =
      req.body;
    const rows = await postgresQuery(
      "@@QUERY@@",
      [@@IDENTIFIER@@],
      [@@PARAMETERS@@]
    );
    res.status(200).json(rows);
  } catch (err) {
    console.log({ @@CONTROLLER_FUNCTION_NAME@@Err: err });
    res.status(400).json({ message: err.message });
  }
}
module.exports = {
  router,
  @@CONTROLLER_FUNCTION_NAME@@,
};
`;
module.exports = {
  routerTemplate,
};
