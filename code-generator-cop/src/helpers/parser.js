const Convert = require("./transformName");

const opToName = {
  "!=": "NotEq",
  ">": "Gt",
  ">=": "Gte",
  "=": "Eq",
  "<": "Lt",
  "<=": "Lte",
  "IS NULL": "IsNull",
  "IS NOT NULL": "IsNotNull",
  LIKE: "Like",
  ILIKE: "Ilike",
};

class ConfigParser {
  static serviceName(entity) {
    return Convert.snakeToPascal(`${entity.name}Service`);
  }

  static controllerName(entity) {
    return Convert.snakeToPascal(`${entity.name}Controller`);
  }

  static fileName(viewObject) {
    if (viewObject) {
      return `${Convert.snakeToCamel(viewObject.name)}.js`;
    }
    return "index.js";
  }

  static serviceFileName(entity) {
    return `${Convert.snakeToCamel(entity.name)}.js`;
  }

  static controllerFileName(entity) {
    return `${Convert.snakeToCamel(entity.name)}.js`;
  }

  static routerFileName(entity) {
    return `${Convert.snakeToCamel(entity.name)}.js`;
  }

  static baseUrlName(entity) {
    return Convert.snakeToCamel(entity.name);
  }

  static urlName(clauseBy) {
    const name = ConfigParser.getName(clauseBy);
    if (name) {
      return name;
    }
    const whereObject = ConfigParser.createWhereObject(clauseBy);
    let urlPath = "";
    let first = true;
    whereObject.forEach((e) => {
      if (first) {
        first = false;
        urlPath += `${Convert.snakeToCamel(e.name)}${opToName[e.op]}`;
      } else {
        urlPath += `And${Convert.snakeToPascal(e.name)}${opToName[e.op]}`;
      }
    });
    return urlPath;
  }

  static serviceMethodName(clauseBy, prefix = "selectBy") {
    const name = ConfigParser.getName(clauseBy);
    if (name) {
      return `${prefix}${name}`;
    }
    const whereObject = ConfigParser.createWhereObject(clauseBy);
    const nameArr = whereObject.map(
      (e) => `${Convert.snakeToPascal(e.name)}${opToName[e.op]}`
    );
    return `${prefix}${nameArr.join("And")}`;
  }

  static controllerMethodName(clauseBy, prefix = "getBy") {
    const name = ConfigParser.getName(clauseBy);
    if (name) {
      return `${prefix}${name}`;
    }
    let methodName = prefix;
    let first = true;
    const whereObject = ConfigParser.createWhereObject(clauseBy);
    whereObject.forEach((e) => {
      if (first) {
        first = false;
        methodName += `${Convert.snakeToPascal(e.name)}${opToName[e.op]}`;
      } else {
        methodName += `And${Convert.snakeToPascal(e.name)}${opToName[e.op]}`;
      }
    });
    return methodName;
  }

  static queryString(clauseBy) {
    const whereObject = ConfigParser.createWhereObject(clauseBy);
    return whereObject
      .map((e) => `${e.name}${opToName[e.op]}=\${${e.name}${opToName[e.op]}}`)
      .join("&");
  }

  static argumentStatement(clauseBy, select = true) {
    const whereObject = ConfigParser.createWhereObject(clauseBy);
    const scaf = select
      ? '{ limit = 1, offset = 0 , sort = "idx", drt = "asc", @@OTHER@@}'
      : "{@@OTHER@@}";
    const littleSfac = "@@NAME@@";
    const tempArray = whereObject.map((e) =>
      littleSfac.replace("@@NAME@@", `${e.name}${opToName[e.op]}`)
    );
    return scaf.replace("@@OTHER@@", tempArray.join(", "));
  }

  static whereStatement(clauseBy) {
    const whereObject = ConfigParser.createWhereObject(clauseBy);
    const scaf = '{ attr: "@@PROP@@", op: "@@OP@@", val: @@PROP_VAL@@ }';
    const tempArray = whereObject.map((e) => {
      let temp = scaf.replace("@@PROP@@", e.name);
      temp = temp.replace("@@PROP_VAL@@", `${e.name}${opToName[e.op]}`);
      temp = temp.replace("@@OP@@", e.op);
      return temp;
    });
    return `[${tempArray.join(", ")}]`;
  }

  static createWhereObject(clauseBy) {
    const arr = clauseBy.split("##");
    const whereString = arr[arr.length - 1];
    if (!whereString) {
      return [];
    }
    const whereObject = whereString.split(",").map((e) => {
      const [name, op] = e.split("@@");
      return { name, op };
    });
    return whereObject;
  }

  static getColumns(clauseBy) {
    return clauseBy.split("##")[2];
  }

  static isCount(clauseBy) {
    return clauseBy.split("##")[1] === "true";
  }

  static getName(clauseBy) {
    if (clauseBy.includes("##")) {
      return clauseBy.split("##")[0];
    }
    return undefined;
  }

  static createArguments(argument) {
    return `{ ${argument.join(", ")} }`;
  }

  static createParameters(parameters) {
    return `[ ${parameters.join(", ")} ]`;
  }

  static getEntityName(entity) {
    return entity.name;
  }

  static getSchemaName(entity) {
    return entity.schema ? `${entity.schema}.` : "";
  }
}

module.exports = ConfigParser;
