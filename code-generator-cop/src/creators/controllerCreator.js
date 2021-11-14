const path = require("path");
const ConfigParser = require("../helpers/parser");
const serverController = require("../../constants/controllers");

class ControllerCreator {
  static async fileData(entity, options) {
    let scaffold = serverController.controller;
    let post = "";
    let getBy = "";
    let putBy = "";
    let deleteBy = "";
    scaffold = scaffold
      .split("@@PATH@@")
      .join(path.relative(options.controllers, options.services));
    scaffold = scaffold.replace("@@SERVICE_NAME@@", ConfigParser.serviceName(entity));
    scaffold = scaffold.replace("@@SERVICE_FILE_NAME@@", ConfigParser.serviceFileName(entity));
    scaffold = scaffold
      .split("@@CONTROLLER_CLASS_NAME@@")
      .join(ConfigParser.controllerName(entity));

    const loggerImport = serverController.loggerImport
      .split("@@PATH@@")
      .join(path.relative(options.controllers, options.helpers));
    scaffold = scaffold.split("@@LOGGER_IMPORT@@").join(entity.logger ? loggerImport : "");

    if (entity.type === "sp") {
      post = ControllerCreator.createExecute(entity);
      post = this.createLogger(entity, post);
    }
    if (entity.type === "view") {
      getBy = ControllerCreator.createGetBy(entity);
    }
    if (entity.type === "table") {
      if (entity.insert) {
        post = ControllerCreator.createPost(entity);
      }
      getBy = ControllerCreator.createGetBy(entity);
      putBy = ControllerCreator.createPutBy(entity);
      deleteBy = ControllerCreator.createDeleteBy(entity);
    }
    scaffold = scaffold.replace("@@POST@@", post);
    scaffold = scaffold.replace("@@GET_BY@@", getBy);
    scaffold = scaffold.replace("@@PUT_BY@@", putBy);
    scaffold = scaffold.replace("@@DELETE_BY@@", deleteBy);
    return scaffold;
  }

  static createExecute(entity) {
    return serverController.execute
      .replace("@@SERVICE_CLASS_NAME@@", ConfigParser.serviceName(entity))
      .replace("@@ENTITY_NAME@@", ConfigParser.getEntityName(entity));
  }

  static createGetAll(entity) {
    const getAll = serverController.getAll
      .replace("@@SERVICE_CLASS_NAME@@", ConfigParser.serviceName(entity))
      .replace("@@ENTITY_NAME@@", ConfigParser.getEntityName(entity));
    return this.createLogger(entity, getAll);
  }

  static createGetBy(entity) {
    const getBy = entity.selectBy.map((clause) => {
      let getByPart = serverController.getBy.replace(
        "@@SERVICE_CLASS_NAME@@",
        ConfigParser.serviceName(entity)
      );
      getByPart = getByPart.replace(
        "@@CONTROLLER_METHOD_NAME@@",
        ConfigParser.controllerMethodName(clause)
      );
      getByPart = getByPart
        .replace("@@SERVICE_METHOD_NAME@@", ConfigParser.serviceMethodName(clause))
        .replace("@@ENTITY_NAME@@", ConfigParser.getEntityName(entity));
      getByPart = this.createLogger(entity, getByPart);
      return getByPart;
    });
    return getBy.join("\n");
  }

  static createPost(entity) {
    const post = serverController.post
      .replace("@@SERVICE_CLASS_NAME@@", ConfigParser.serviceName(entity))
      .replace("@@ENTITY_NAME@@", ConfigParser.getEntityName(entity));
    return this.createLogger(entity, post);
  }

  static createPut(entity) {
    const put = serverController.put
      .replace("@@SERVICE_CLASS_NAME@@", ConfigParser.serviceName(entity))
      .replace("@@ENTITY_NAME@@", ConfigParser.getEntityName(entity));
    return this.createLogger(entity, put);
  }

  static createPutBy(entity) {
    const putBy = entity.updateBy.map((clause) => {
      let putByPart = serverController.putBy.replace(
        "@@SERVICE_CLASS_NAME@@",
        ConfigParser.serviceName(entity)
      );
      putByPart = putByPart.replace(
        "@@CONTROLLER_METHOD_NAME@@",
        ConfigParser.controllerMethodName(clause, "putBy")
      );
      putByPart = putByPart
        .replace("@@SERVICE_METHOD_NAME@@", ConfigParser.serviceMethodName(clause, "updateBy"))
        .replace("@@ENTITY_NAME@@", ConfigParser.getEntityName(entity));
      putByPart = this.createLogger(entity, putByPart);
      return putByPart;
    });
    return putBy.join("\n");
  }

  static createDeleteBy(entity) {
    const deleteBy = entity.deleteBy.map((clause) => {
      let deleteByPart = serverController.deleteBy.replace(
        "@@SERVICE_CLASS_NAME@@",
        ConfigParser.serviceName(entity)
      );
      deleteByPart = deleteByPart.replace(
        "@@CONTROLLER_METHOD_NAME@@",
        ConfigParser.controllerMethodName(clause, "deleteBy")
      );
      deleteByPart = deleteByPart
        .replace("@@SERVICE_METHOD_NAME@@", ConfigParser.serviceMethodName(clause, "deleteBy"))
        .replace("@@ENTITY_NAME@@", ConfigParser.getEntityName(entity));
      deleteByPart = this.createLogger(entity, deleteByPart);
      return deleteByPart;
    });
    return deleteBy.join("\n");
  }

  static createLogger(entity, fragment) {
    return fragment.replace("@@LOGGER@@", entity.logger ? serverController.logger : "");
  }
}

module.exports = ControllerCreator;
