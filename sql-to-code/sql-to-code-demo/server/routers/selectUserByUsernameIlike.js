// e24d3eb22c0516caf131cf25b266b747
const express = require("express");
const {
  postgresQuery,
  authenticate,
  authorize,
  codeToSqlConfig: {
    conf: {
      PERMISSIONS: { WORKER, SUPERVISOR },
    },
  },
} = require("../../sql_to_code_config");
const router = express.Router();
router.use(authenticate);
router.use(authorize([WORKER, SUPERVISOR]));
router.post("/api/selectUserByUsernameIlike", selectUserByUsernameIlike);
/** @type {import("express").Handler} */
async function selectUserByUsernameIlike(req, res) {
  try {
    const { orderByColumn, orderByDirection, usernameIlike, offset, limit } =
      req.body;
    const rows = await postgresQuery(
      "Select * from t_sys_users where username ilike $1 ordery by %s %s offset $2 limit $3",
      [orderByColumn, orderByDirection],
      [usernameIlike, offset, limit]
    );
    res.status(200).json(rows);
  } catch (err) {
    console.log({ selectUserByUsernameIlikeErr: err });
    res.status(400).json({ message: err.message });
  }
}
module.exports = {
  router,
  selectUserByUsernameIlike,
};
