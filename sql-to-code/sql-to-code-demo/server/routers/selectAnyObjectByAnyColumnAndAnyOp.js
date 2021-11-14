// cb95a1492075159b8e56babe764cd284
const express = require("express");
const {
  postgresQuery,
  authenticate,
  authorize,
  codeToSqlConfig: {
    conf: {
      PERMISSIONS: { CEO },
    },
  },
} = require("../../sql_to_code_config");
const router = express.Router();
router.use(authenticate);
router.use(authorize([CEO]));
router.post("/api/selectAnyObjectByAnyColumnAndAnyOp", selectAnyObjectByAnyColumnAndAnyOp);
/** @type {import("express").Handler} */
async function selectAnyObjectByAnyColumnAndAnyOp(req, res) {
  try {
    const { object, column, operator, orderByColumn, orderByDirection, columnValue, offset, limit } =
      req.body;
    const rows = await postgresQuery(
      "Select * from %s where %s %s $1 order by %s %s offset $2 limit $3",
      [object, column, operator, orderByColumn, orderByDirection],
      [columnValue, offset, limit]
    );
    res.status(200).json(rows);
  } catch (err) {
    console.log({ selectAnyObjectByAnyColumnAndAnyOpErr: err });
    res.status(400).json({ message: err.message });
  }
}
module.exports = {
  router,
  selectAnyObjectByAnyColumnAndAnyOp,
};
