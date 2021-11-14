const CG_CONFIG_FILE_PATH = process.env.PWD;
const CG_CONFIG_FILE_NAME = "cg.config.js";
const CG_FORMATTER = "prettier";
const FIELD_SEPERATOR = ",";
const OPERATOR_SEPERATOR = "@@";
const OPERATOR_TO_STRING = {
  "=": "Eq",
  ">": "Gt",
  "<": "Lt",
  "=>": "Gte",
  "=<": "Lte",
  ILIKE: "Ilike",
  LIKE: "Like",
  "IS NULL": "IsNull",
  "IS NOT NULL": "IsNotNull",
};
module.exports = {
  CG_CONFIG_FILE_PATH,
  CG_CONFIG_FILE_NAME,
  CG_FORMATTER,
  FIELD_SEPERATOR,
  OPERATOR_SEPERATOR,
  OPERATOR_TO_STRING,
};
