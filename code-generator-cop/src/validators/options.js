function validateoptions(data) {
  if (!(typeof data.options === "object")) {
    throw new Error("options object property is required in cop-config.json");
  }
  if (!(typeof data.options.serviceUrl === "string")) {
    throw new Error("options.serviceUrl string property is required in cop-config.json");
  }
  if (!(typeof data.options.paths === "object")) {
    throw new Error("options.paths object property is required in cop-config.json");
  }
  if (!(typeof data.options.paths.services === "string")) {
    throw new Error("options.paths.services string property is required in cop-config.json");
  }
  if (!(typeof data.options.paths.controllers === "string")) {
    throw new Error("options.paths.controllers string property is required in cop-config.json");
  }
  if (!(typeof data.options.paths.routers === "string")) {
    throw new Error("options.paths.routers string property is required in cop-config.json");
  }
  if (!(typeof data.options.paths.helpers === "string")) {
    throw new Error("options.paths.helpers string property is required in cop-config.json");
  }
  if (!(typeof data.options.paths.apis === "string")) {
    throw new Error("options.paths.apis string property is required in cop-config.json");
  }
  if (!(typeof data.options.createHelpers === "boolean")) {
    throw new Error("options.createHelpers boolean property is required in cop-config.json");
  }
  if (!(typeof data.options.createServices === "boolean")) {
    throw new Error("options.createServices property is required in cop-config.json");
  }
  if (!(typeof data.options.createControllers === "boolean")) {
    throw new Error("options.createControllers boolean property is required in cop-config.json");
  }
  if (!(typeof data.options.createRouters === "boolean")) {
    throw new Error("options.createRouters boolean property is required in cop-config.json");
  }
  if (!(typeof data.options.createApis === "boolean")) {
    throw new Error("options.createApis boolean property is required in cop-config.json");
  }
}

module.exports = validateoptions;
