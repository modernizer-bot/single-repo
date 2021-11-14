const authR = `const express = require("express");
const Auth = require("./authC");
const query = require("./postgres");

const router = express.Router();

router.get("/status", (_req, res) => {
  res.status(200).end();
});

router.get("/database/status", async (_req, res) => {
  try {
    query({ text: "SELECT now();", values: [] });
    res.status(200).end();
  } catch (err) {
    console.log({ databaseStatusErr: err });
    res.status(400).end();
  }
});

router.get("/auth/status", Auth.authenticate, (_req, res) => {
  res.status(200).end();
});

router.post("/auth/login", Auth.login);

router.post("/auth/logout", Auth.authenticate, Auth.logout);

module.exports = router;
`;

module.exports = authR;
