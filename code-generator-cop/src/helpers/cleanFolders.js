const fs = require("fs");

function cleanFolders(options) {
  try {
    if (options.createServices) {
      if (fs.existsSync(options.paths.services)) {
        throw new Error(`geco: ${options.paths.services} folder must not be exists`);
      }
      fs.mkdirSync(options.paths.services, { recursive: true });
    }
    if (options.createControllers) {
      if (fs.existsSync(options.paths.controllers)) {
        throw new Error(`geco: ${options.paths.controllers} folder must not be exists`);
      }
      fs.mkdirSync(options.paths.controllers, { recursive: true });
    }
    if (options.createRouters) {
      if (fs.existsSync(options.paths.routers)) {
        throw new Error(`geco: ${options.paths.routers} folder must not be exists`);
      }
      fs.mkdirSync(options.paths.routers, { recursive: true });
    }
    if (options.createApis) {
      if (fs.existsSync(options.paths.apis)) {
        throw new Error(`geco: ${options.paths.apis} folder must not be exists`);
      }
      fs.mkdirSync(options.paths.apis, { recursive: true });
    }
    if (options.createHelpers) {
      if (fs.existsSync(options.paths.helpers)) {
        throw new Error(`geco: ${options.paths.helpers} folder must not be exists`);
      }
      fs.mkdirSync(options.paths.helpers, { recursive: true });
    }
  } catch (err) {
    console.log({ cleanFoldersErr: err.message });
    process.exit(1);
  }
}

module.exports = cleanFolders;
