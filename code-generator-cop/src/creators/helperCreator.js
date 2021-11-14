const fs = require("fs");
const path = require("path");
const serverAuthC = require("../../constants/helpers/authC");
const serverAuthR = require("../../constants/helpers/authR");
const serverconfig = require("../../constants/helpers/config");
const serverPermission = require("../../constants/helpers/permissions");
const serverPostgres = require("../../constants/helpers/postgres");
const gres = require("../../constants/helpers/gres");
const serverLogger = require("../../constants/helpers/logger");
const { helper } = require("../../constants/apis/helper");

class HelperCreator {
  static writeData(options) {
    console.log({ options });
    try {
      if (options.createApis) {
        fs.mkdirSync(options.paths.apis, { recursive: true });
        fs.writeFileSync(
          path.join(options.paths.apis, "helper.js"),
          helper.replace("@@SERVICE_URL@@", options.serviceUrl),
          {
            encoding: "utf-8",
          }
        );
      }
      if (options.createHelpers) {
        fs.mkdirSync(options.paths.helpers, { recursive: true });

        fs.writeFileSync(path.join(options.paths.helpers, "authC.js"), serverAuthC, {
          encoding: "utf-8",
        });
        fs.writeFileSync(path.join(options.paths.helpers, "authR.js"), serverAuthR, {
          encoding: "utf-8",
        });
        fs.writeFileSync(path.join(options.paths.helpers, "config.js"), serverconfig, {
          encoding: "utf-8",
        });
        fs.writeFileSync(path.join(options.paths.helpers, "permissions.js"), serverPermission, {
          encoding: "utf-8",
        });
        fs.writeFileSync(path.join(options.paths.helpers, "postgres.js"), serverPostgres, {
          encoding: "utf-8",
        });
        fs.writeFileSync(path.join(options.paths.helpers, "gres.js"), gres, {
          encoding: "utf-8",
        });
        fs.writeFileSync(path.join(options.paths.helpers, "logger.js"), serverLogger, {
          encoding: "utf-8",
        });
      }
    } catch (err) {
      console.log({ HelperCreatorErr: err.message });
      process.exit(1);
    }
  }
}

module.exports = HelperCreator;
