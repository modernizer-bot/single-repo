const authR = `@@SIGNATURE@@
const express = require("express");
const { login, register } = require("./authC");

const router = express.Router();

router.post("/login", login);

router.post("/register", register);

module.exports = { router };
`;

module.exports = { authR };
