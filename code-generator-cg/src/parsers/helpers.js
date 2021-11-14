const { capitalizeFirstLetter } = require("../helpers/capitilazeFirstLetter");
const { OPERATOR_TO_STRING, OPERATOR_SEPERATOR } = require("../helpers/config");
const { snakeToCamel } = require("../helpers/transformName");

/** @type {(whereStringArr:string[]) => string} */
function parseArgumentString(whereStringArr) {
  return whereStringArr
    .map((whereString) => {
      const [field, operator] = whereString.split(OPERATOR_SEPERATOR);
      return field + OPERATOR_TO_STRING[operator];
    })
    .join(", ");
}

/** @type {(whereStringArr:string[]) => string} */
function parseQueryString(whereStringArr) {
  return whereStringArr
    .map((whereString) => {
      const [field, operator] = whereString.split(OPERATOR_SEPERATOR);
      const fieldName = field + OPERATOR_TO_STRING[operator];
      return `${fieldName}=\${${fieldName}}`;
    })
    .join("&");
}

/** @type {(prefix:string, tableName:string, whereStringArr:string[]) => string} */
function parseFunctionName(prefix, tableName, whereStringArr) {
  return `${snakeToCamel(tableName)}${prefix}${whereStringArr
    .map((whereString) => {
      const [field, operator] = whereString.split(OPERATOR_SEPERATOR);
      const fieldName = field + OPERATOR_TO_STRING[operator];
      return capitalizeFirstLetter(fieldName);
    })
    .join("And")}`;
}

/** @type {(prefix:string, whereStringArr:string[]) => string} */
function parseUrlPath(prefix, whereStringArr) {
  return `${prefix}${whereStringArr
    .map((whereString) => {
      const [field, operator] = whereString.split(OPERATOR_SEPERATOR);
      const fieldName = field + OPERATOR_TO_STRING[operator];
      return capitalizeFirstLetter(fieldName);
    })
    .join("And")}`;
}

/** @type {(whereStringArr:string[]) => string} */
function parseWhereString(whereStringArr) {
  return `${whereStringArr
    .map((whereString) => {
      const [field, operator] = whereString.split(OPERATOR_SEPERATOR);
      const fieldName = field + OPERATOR_TO_STRING[operator];
      return `{attr:"${field}",op:"${operator}",val:${fieldName}}`
    })
    .join(", ")}`;
}

module.exports = {
  parseArgumentString,
  parseQueryString,
  parseFunctionName,
  parseUrlPath,
  parseWhereString,
};
