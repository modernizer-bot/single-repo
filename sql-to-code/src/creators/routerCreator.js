const path = require("path");
const fs = require("fs");
const { routerTemplate } = require("../templates/routerTemplate");
const chalk = require("chalk");
const { createHashOfContent } = require("../helpers/createHashOfContent");
const { checkHashOfContent } = require("../helpers/checkHashOfContent");
const { readCommandLine } = require("../helpers/readCommandLine");

/** @type {(queries:import("../..").Queries, conf:import("../..").Conf) => Promise<void>} */
async function createRouters(queries, conf) {
  for (const key in queries) {
    const queryItem = queries[key];
    const PERMISSIONS = queryItem.permissions.join(", ");
    const SQL_TO_CODE_CONFIG_PATH = path.relative(
      path.join(process.cwd(), conf.serverFilesPath),
      process.cwd()
    );
    const ROUTER_PATH = key;
    const CONTROLLER_FUNCTION_NAME = key;
    const IDENTIFIERS_AND_PARAMETERS = [
      ...queryItem.identifiers,
      ...queryItem.parameters,
    ].join(", ");
    const QUERY = queryItem.query;
    const IDENTIFIER = queryItem.identifiers.join(", ");
    const PARAMETERS = queryItem.parameters.join(", ");
    const content = routerTemplate
      .replace("@@PERMISSIONS@@", PERMISSIONS)
      .replace("@@SQL_TO_CODE_CONFIG_PATH@@", SQL_TO_CODE_CONFIG_PATH)
      .replace("@@PERMISSIONS@@", PERMISSIONS)
      .replace("@@ROUTER_PATH@@", ROUTER_PATH)
      .replace("@@CONTROLLER_FUNCTION_NAME@@", CONTROLLER_FUNCTION_NAME)
      .replace("@@IDENTIFIERS_AND_PARAMETERS@@", IDENTIFIERS_AND_PARAMETERS)
      .replace("@@QUERY@@", QUERY)
      .replace("@@IDENTIFIER@@", IDENTIFIER)
      .replace("@@PARAMETERS@@", PARAMETERS)
      .replace("@@CONTROLLER_FUNCTION_NAME@@", CONTROLLER_FUNCTION_NAME)
      .replace("@@CONTROLLER_FUNCTION_NAME@@", CONTROLLER_FUNCTION_NAME)
      .replace("@@CONTROLLER_FUNCTION_NAME@@", CONTROLLER_FUNCTION_NAME);
    const hash = createHashOfContent(content);
    const filePath = path.join(
      process.cwd(),
      conf.serverFilesPath,
      `${key}.js`
    );
    let override = false;
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath).toString();
      if (!checkHashOfContent(fileContent)) {
        console.log(
          chalk.red(`Router ${key}.js hash is NOT VERIFIED, `) +
            chalk.yellow("CONTENT must be CHANGED")
        );
        console.log(
          chalk.blue(`Do you want to OVERWRITE router ${key}.js ? [y] [N]`)
        );
        override = readCommandLine();
        if (!override) {
          console.log(chalk.yellow(`Router ${key}.js file is SKIPPED`));
          continue;
        }
      }
    }
    fs.writeFileSync(filePath, hash.concat(content), { encoding: "utf-8" });
    if (override) {
      console.log(chalk.yellow(`Router ${key}.js OVERWROTE`));
    } else {
      console.log(chalk.green(`Router ${key}.js CREATED`));
    }
  }
}

module.exports = {
  createRouters,
};
