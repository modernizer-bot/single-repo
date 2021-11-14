const ConfigParser = require("../helpers/parser");
const serverRouter = require("../../constants/routers");

class IndexRouterCreator {
  static async fileData(entities) {
    const importRouters = entities.map((entity) => {
      if (entity.rest) {
        let routerImport = serverRouter.routerImport.replace(
          "@@URL@@",
          ConfigParser.baseUrlName(entity)
        );
        routerImport = routerImport.replace(
          "@@ROUTER_FILE_NAME@@",
          ConfigParser.routerFileName(entity)
        );
        return routerImport;
      }
      return "";
    });
    const scaffold = serverRouter.indexRouter.replace(
      "@@IMPORT_ROUTER@@",
      importRouters.join("\n")
    );
    return scaffold;
  }
}

module.exports = IndexRouterCreator;
