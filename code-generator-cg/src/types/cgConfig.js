/**
 * @typedef {{
 *  conn:string;
 *  url:string;
 *  formatter: string;
 *  permissions: {
 *      schema: string;
 *      tableName: string,
 *      idCol: string;
 *      nameCol: string;
 *  }
 *  paths:{
 *      apis: string;
 *      routers: string;
 *      controllers: string;
 *      services: string;
 *      helpers: string;
 *  };
 *  tables: CgTable[];
 *  views: CgView[];
 *  sp: CgSp[];
 * }} CgConfig
 * 
 * @typedef {{
 *      schema?: string;
 *      auth:boolean;
 *      logger: boolean;
 *      rest: boolean;
 *      insert: boolean;
 *      select: boolean;
 *      permissions: string[];
 *      selectBy: string[];
 *      updateBy: string[];
 *      deleteBy: string[];
 *  }} CgTable
 * 
 * @typedef {{
 *      schema?: string;
 *      auth:boolean;
 *      logger: boolean;
 *      rest: boolean;
 *      select: boolean;
 *      permissions: string[];
 *      selectBy: string[];
 *  }} CgView
 * 
 * @typedef {{
 *      schema?: string;
 *      auth:boolean;
 *      rest: boolean;
 *      logger: boolean;
 *      call?: boolean;
 *      permissions: string[];
 *      parameters: string[];
 *  }} CgSp
 * 
 */

module.exports = {}