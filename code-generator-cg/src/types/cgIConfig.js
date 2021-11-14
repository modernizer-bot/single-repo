/**
 * @typedef {{
 *  signature: string;
 *  conn: string;
 *  url: string;
 *  formatter: string;
 *  permissions: string;
 *  paths:{
 *      apis: string;
 *      routers: string;
 *      controllers: string;
 *      services: string;
 *      helpers: string;
 *  };
 *  helpersFileNames: {
 *      clientAuth: string;
 *      clientHelper: string;
 *      authController: string;
 *      authRouter: string;
 *      config: string;
 *      gres: string;
 *      logger: string;
 *      permissions: string;
 *      postgres: string;
 *      indexRouter: string;
 *  }
 *  relativePaths: {
 *      relativeHelperPathFromService: string;
 *      relativeServicePathFromController: string;
 *      relativeControllerPathFromRouter: string;
 *      relativeHelperPathfromRouter: string;
 *      relativeHelperPathFromController: string;
 *  }
 *  tables: {
 *      [key:string]: CgITable;
 *  }
 *  views: {
 *      [key:string]: CgIView;
 *  }
 *  sp: {
 *      [key:string]: CgISp;
 *  }
 * }} CgIConfig
 *
 * @typedef {{
 *  name: string;
 *  entityName: string;
 *  fileName: string;
 *  importFileName: string;
 *  apiInsertFunctionName: string;
 *  apiSelectFunctionName: string;
 *  controllerInsertFunctionName: string;
 *  controllerSelectFunctionName: string;
 *  serviceInsertFunctionName: string;
 *  serviceSelectFunctionName: string;
 *  baseUrl: string;
 *  auth: boolean;
 *  logger: boolean;
 *  rest: boolean;
 *  select: boolean;
 *  insert: boolean;
 *  permissions: string;
 *  getBy: CgITableGetBy[];
 *  putBy: CgITablePutBy[];
 *  deleteBy: CgITableDeleteBy[];
 * }} CgITable
 *
 * @typedef {{
 *  name: string;
 *  entityName: string;
 *  fileName: string;
 *  importFileName: string;
 *  apiSelectFunctionName: string;
 *  controllerSelectFunctionName: string;
 *  serviceSelectFunctionName: string;
 *  baseUrl: string;
 *  auth: boolean;
 *  logger: boolean;
 *  rest: boolean;
 *  select: boolean;
 *  permissions: string;
 *  getBy: CgIViewGetBy[];
 * }} CgIView
 *
 * @typedef {{
 *  name: string;
 *  entityName: string;
 *  fileName: string;
 *  call: string;
 *  importFileName: string;
 *  apiExecuteFunctionName: string;
 *  controllerExecuteFunctionName: string;
 *  serviceExecuteFunctionName: string;
 *  rest: boolean;
 *  auth: boolean;
 *  logger: boolean;
 *  permissions: string;
 *  arguments: string;
 *  baseUrl: string;
 * }} CgISp
 *
 * @typedef {{
 *      apiFunctionName: string;
 *      controllerFunctionName: string;
 *      serviceFunctionName: string;
 *      arguments: string;
 *      urlPath: string;
 *      queryString: string;
 *      whereString: string;
 *      count: boolean;
 *  }} CgITableGetBy
 *
 * @typedef {{
 *      apiFunctionName: string;
 *      controllerFunctionName: string;
 *      serviceFunctionName: string;
 *      arguments: string;
 *      urlPath: string;
 *      queryString: string;
 *      whereString: string;
 *  }} CgITablePutBy
 *
 * @typedef {{
 *      apiFunctionName: string;
 *      controllerFunctionName: string;
 *      serviceFunctionName: string;
 *      arguments: string;
 *      urlPath: string;
 *      queryString: string;
 *      whereString: string;
 *  }} CgITableDeleteBy
 * 
 * @typedef {{
 *      apiFunctionName: string;
 *      controllerFunctionName: string;
 *      serviceFunctionName: string;
 *      arguments: string;
 *      urlPath: string;
 *      queryString: string;
 *      whereString: string;
 *      count: boolean;
 *  }} CgIViewGetBy
 *
 */

module.exports = {};
