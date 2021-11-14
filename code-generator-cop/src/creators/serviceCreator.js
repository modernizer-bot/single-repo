const path = require("path");
const ConfigParser = require("../helpers/parser");
const serverService = require("../../constants/services");

class ServiceCreator {
  static async fileData(entity, options) {
    let scaffold = serverService.service;
    let insert = "";
    let execute = "";
    let selectBy = "";
    let updateBy = "";
    let deleteBy = "";
    scaffold = scaffold
      .split("@@SERVICE_NAME@@")
      .join(ConfigParser.serviceName(entity));
    scaffold = scaffold
      .split("@@PATH@@")
      .join(path.relative(options.services, options.helpers));
    if (entity.type === "sp") {
      execute = ServiceCreator.createExecute(entity);
    }
    if (entity.type === "view") {
      selectBy = ServiceCreator.createSelectBy(entity);
    }
    if (entity.type === "table") {
      if (entity.insert) {
        insert = ServiceCreator.createInsert(entity);
      }
      selectBy = ServiceCreator.createSelectBy(entity);
      updateBy = ServiceCreator.createUpdateBy(entity);
      deleteBy = ServiceCreator.createDeleteBy(entity);
    }
    scaffold = scaffold.replace("@@EXECUTE@@", execute);
    scaffold = scaffold.replace("@@INSERT@@", insert);
    scaffold = scaffold.replace("@@SELECT_BY@@", selectBy);
    scaffold = scaffold.replace("@@UPDATE_BY@@", updateBy);
    scaffold = scaffold.replace("@@DELETE_BY@@", deleteBy);

    return scaffold;
  }

  static createExecute(entity) {
    let execute = serverService.execute.replace(
      "@@ARGUMENTS@@",
      ConfigParser.createArguments(entity.parameters)
    );
    execute = execute.replace("@@SCHEMA@@", ConfigParser.getSchemaName(entity));
    execute = execute.replace(
      "@@ENTITY_NAME@@",
      ConfigParser.getEntityName(entity)
    );
    execute = execute.replace(
      "@@ENTITY_NAME@@",
      entity.call ? entity.call_output_name : entity.name
    );
    execute = execute.replace(
      "@@ENTITY_NAME@@",
      entity.call ? entity.call_output_name : entity.name
    );
    execute = execute.replace("@@CALL@@", entity.call ? ", true" : "");
    execute = execute.replace(
      "@@PARAMETERS_ARRAY@@",
      ConfigParser.createParameters(entity.parameters)
    );
    return execute;
  }

  static createSelectBy(entity) {
    const selectByArray = entity.selectBy.map((clause) => {
      const template = ConfigParser.isCount(clause)
        ? serverService.selectByWithCount
        : serverService.selectByWithoutCount;
      let selectBy = template
        .split("@@ENTITY_NAME@@")
        .join(ConfigParser.getEntityName(entity))
        .split("@@SCHEMA@@")
        .join(ConfigParser.getSchemaName(entity));
      selectBy = selectBy.replace(
        "@@COLUMNS@@",
        ServiceCreator.createColumnsArray(clause)
      );
      const methodName = ConfigParser.serviceMethodName(clause);
      selectBy = selectBy.replace("@@METHOT_NAME@@", methodName);
      const whereStatement = ConfigParser.whereStatement(clause);
      selectBy = selectBy.split("@@WHERE_ARRAY@@").join(whereStatement);
      const argumentStatement = ConfigParser.argumentStatement(clause);
      selectBy = selectBy.replace("@@ARGUMENT_OBJECT@@", argumentStatement);
      return selectBy;
    });

    return selectByArray.join("\n");
  }

  static createColumnsArray(clause) {
    const columns = ConfigParser.getColumns(clause);
    return `[${columns
      .split(",")
      .map((e) => `"${e}"`)
      .join(", ")}]`;
  }

  static createInsert(viewObject) {
    return serverService.insert
      .replace("@@ENTITY_NAME@@", ConfigParser.getEntityName(viewObject))
      .replace("@@ENTITY_NAME@@", ConfigParser.getEntityName(viewObject))
      .replace("@@SCHEMA@@", ConfigParser.getSchemaName(viewObject));
  }

  static createUpdateBy(entity) {
    const updateByArray = entity.updateBy.map((clause) => {
      let updateByPart = serverService.updateBy
        .split("@@ENTITY_NAME@@")
        .join(ConfigParser.getEntityName(entity))
        .replace("@@SCHEMA@@", ConfigParser.getSchemaName(entity));
      const methodName = ConfigParser.serviceMethodName(clause, "updateBy");
      updateByPart = updateByPart.replace("@@METHOT_NAME@@", methodName);
      const whereStatement = ConfigParser.whereStatement(clause);
      updateByPart = updateByPart.split("@@WHERE_ARRAY@@").join(whereStatement);
      const argumentStatement = ConfigParser.argumentStatement(clause, false);
      updateByPart = updateByPart.replace(
        "@@ARGUMENT_OBJECT@@",
        argumentStatement
      );
      return updateByPart;
    });
    return updateByArray.join("\n");
  }

  static createDeleteBy(entity) {
    const deleteByArray = entity.deleteBy.map((clause) => {
      let deleteByPart = serverService.deleteBy
        .split("@@ENTITY_NAME@@")
        .join(ConfigParser.getEntityName(entity))
        .replace("@@SCHEMA@@", ConfigParser.getSchemaName(entity));
      const methodName = ConfigParser.serviceMethodName(clause, "deleteBy");
      deleteByPart = deleteByPart.replace("@@METHOT_NAME@@", methodName);
      const whereStatement = ConfigParser.whereStatement(clause);
      deleteByPart = deleteByPart.split("@@WHERE_ARRAY@@").join(whereStatement);
      const argumentStatement = ConfigParser.argumentStatement(clause, false);
      deleteByPart = deleteByPart.replace(
        "@@ARGUMENT_OBJECT@@",
        argumentStatement
      );
      return deleteByPart;
    });
    return deleteByArray.join("\n");
  }
}

module.exports = ServiceCreator;
