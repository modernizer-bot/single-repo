const path = require("path");
const fs = require("fs");
const { apiTemplate } = require("../templates/apiTemplate");
const chalk = require("chalk");
const { createHashOfContent } = require("../helpers/createHashOfContent");
const { checkHashOfContent } = require("../helpers/checkHashOfContent");
const { readCommandLine } = require("../helpers/readCommandLine");

/** @type {(queries:import("../..").Queries, conf:import("../..").Conf) => Promise<void>} */
async function createApis(queries, conf) {
  for (const key in queries) {
    const queryItem = queries[key];
    const API_FUNCTION_NAME = key;
    const IDENTIFIERS_AND_PARAMETERS = [
      ...queryItem.identifiers,
      ...queryItem.parameters,
    ].join(", ");
    const BASE_URL = conf.appBaseUrl;
    const URL_PATH = key;
    const content = apiTemplate
      .replace("@@API_FUNCTION_NAME@@", API_FUNCTION_NAME)
      .replace("@@IDENTIFIERS_AND_PARAMETERS@@", IDENTIFIERS_AND_PARAMETERS)
      .replace("@@BASE_URL@@", BASE_URL)
      .replace("@@URL_PATH@@", URL_PATH)
      .replace("@@IDENTIFIERS_AND_PARAMETERS@@", IDENTIFIERS_AND_PARAMETERS);
    const hash = createHashOfContent(content);
    const filePath = path.join(
      process.cwd(),
      conf.clientFilesPath,
      `${key}.js`
    );
    let override = false;
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath).toString();
      if (!checkHashOfContent(fileContent)) {
        console.log(
          chalk.red(`Api ${key}.js hash is NOT VERIFIED, `) +
            chalk.yellow("CONTENT must be CHANGED")
        );
        console.log(
          chalk.blue(`Do you want to OVERWRITE api ${key}.js ? [y] [N]`)
        );
        override = readCommandLine();
        if (!override) {
          console.log(chalk.yellow(`Api ${key}.js file is SKIPPED`));
          continue;
        }
      }
    }
    await fs.promises.writeFile(filePath, hash.concat(content), {
      encoding: "utf-8",
    });
    if (override) {
      console.log(chalk.yellow(`Api ${key}.js OVERWROTE`));
    } else {
      console.log(chalk.green(`Api ${key}.js CREATED`));
    }
  }
}

module.exports = { createApis };
