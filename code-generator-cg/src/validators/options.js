// const data = require("../../cop-config.json");
function validateoptions(data) {
  if (!(typeof data.options === "object")) {
    throw new Error("options object property is required in cop-config.json");
  }
  if (!(typeof data.options.paths === "object")) {
    throw new Error(
      "options.paths object property is required in cop-config.json"
    );
  }
  if (!(typeof data.options.paths.serverServices === "string")) {
    throw new Error(
      "options.paths.serverServices property is required in cop-config.json"
    );
  }
  if (!(typeof data.options.paths.serverControllers === "string")) {
    throw new Error(
      "options.paths.serverControllers property is required in cop-config.json"
    );
  }
  if (!(typeof data.options.paths.serverRouters === "string")) {
    throw new Error(
      "options.paths.serverRouters property is required in cop-config.json"
    );
  }
  if (!(typeof data.options.paths.serverHelpers === "string")) {
    throw new Error(
      "options.paths.serverHelpers property is required in cop-config.json"
    );
  }
  if (!(typeof data.options.paths.clientServices === "string")) {
    throw new Error(
      "options.paths.clientServices property is required in cop-config.json"
    );
  }
  if (!(typeof data.options.paths.clientHelpers === "string")) {
    throw new Error(
      "options.paths.clientHelpers property is required in cop-config.json"
    );
  }
  if (!(typeof data.options.createServerHelpers === "boolean")) {
    throw new Error(
      "options.createServerHelpers property is required in cop-config.json"
    );
  }
  if (!(typeof data.options.createClientHelpers === "boolean")) {
    throw new Error(
      "options.createClientHelpers property is required in cop-config.json"
    );
  }
  if (!(typeof data.options.createServerServices === "boolean")) {
    throw new Error(
      "options.createServerServices property is required in cop-config.json"
    );
  }
  if (!(typeof data.options.createServerControllers === "boolean")) {
    throw new Error(
      "options.createServerControllers property is required in cop-config.json"
    );
  }
  if (!(typeof data.options.createServerRouters === "boolean")) {
    throw new Error(
      "options.createServerRouters property is required in cop-config.json"
    );
  }
  if (!(typeof data.options.createClientServices === "boolean")) {
    throw new Error(
      "options.createClientServices property is required in cop-config.json"
    );
  }
}

module.exports = validateoptions;
