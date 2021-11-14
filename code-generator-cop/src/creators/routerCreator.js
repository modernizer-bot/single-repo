/* eslint-disable no-param-reassign */
const path = require("path");
const ConfigParser = require("../helpers/parser");
const serverRouter = require("../../constants/routers");

class RouterCreator {
  static async fileData(entity, options) {
    let scaffold = serverRouter.router;
    let post = "";
    let getBy = "";
    let putBy = "";
    let deleteBy = "";
    scaffold = scaffold.split("@@PATH@@").join(path.relative(options.routers, options.controllers));
    scaffold = scaffold.replace("@@CONTROLLER_CLASS_NAME@@", ConfigParser.controllerName(entity));
    scaffold = scaffold.replace(
      "@@CONTROLLER_FILE_NAME@@",
      ConfigParser.controllerFileName(entity)
    );
    const authImport = serverRouter.authImport
      .split("@@PATH@@")
      .join(path.relative(options.routers, options.helpers));
    scaffold = scaffold.replace("@@AUTH_IMPORT@@", entity.authentication ? authImport : "");

    scaffold = scaffold.replace(
      "@@PERMISSION_IMPORT@@",
      entity.authorization ? serverRouter.permissionImport : ""
    );
    scaffold = scaffold.replace(
      "@@AUTHENTICATION_MIDDLEWARE@@",
      entity.authentication ? serverRouter.autheMw : ""
    );
    const authoMw = serverRouter.authoMw.replace(
      "@@PERMISSION@@",
      RouterCreator.createPermissionArray(entity)
    );
    scaffold = scaffold.replace(
      "@@AUTHORIZATION_MIDDLEWARE@@",
      entity.authorization ? authoMw : ""
    );

    if (entity.type === "sp") {
      post = RouterCreator.createPost(entity);
    }

    if (entity.type === "view") {
      getBy = RouterCreator.createGetBy(entity);
    }

    if (entity.type === "table") {
      if (entity.insert) {
        post = RouterCreator.createPost(entity);
      }
      getBy = RouterCreator.createGetBy(entity);
      putBy = RouterCreator.createPutBy(entity);
      deleteBy = RouterCreator.createDeleteBy(entity);
    }
    scaffold = scaffold.replace("@@POST_ROUTE@@", post);
    scaffold = scaffold.replace("@@GET_BY_ROUTE@@", getBy);
    scaffold = scaffold.replace("@@PUT_BY_ROUTE@@", putBy);
    scaffold = scaffold.replace("@@DELETE_BY_ROUTE@@", deleteBy);
    return scaffold;
  }

  static createPermissionArray(entity) {
    return `[${entity.permission.map((e) => `PERMISSIONS.${e}`).join(", ")}]`;
  }

  static createPost(entity) {
    return serverRouter.post.replace(
      "@@CONTROLLER_CLASS_NAME@@",
      ConfigParser.controllerName(entity)
    );
  }

  static createGetBy(viewObject) {
    const getBy = viewObject.selectBy.map((selectBy) => {
      let getByPart = serverRouter.getBy.replace("@@URL@@", ConfigParser.urlName(selectBy));
      getByPart = getByPart.replace(
        "@@CONTROLLER_CLASS_NAME@@",
        ConfigParser.controllerName(viewObject)
      );
      getByPart = getByPart
        .split("@@CONTROLLER_METHOD_NAME@@")
        .join(ConfigParser.controllerMethodName(selectBy));
      return getByPart;
    });
    return getBy.join("\n");
  }

  static createPutBy(entity) {
    const putBy = entity.updateBy.map((updateBy) => {
      let putByPart = serverRouter.putBy.replace("@@URL@@", ConfigParser.urlName(updateBy));
      putByPart = putByPart.replace(
        "@@CONTROLLER_CLASS_NAME@@",
        ConfigParser.controllerName(entity)
      );
      putByPart = putByPart
        .split("@@CONTROLLER_METHOD_NAME@@")
        .join(ConfigParser.controllerMethodName(updateBy, "putBy"));
      return putByPart;
    });
    return putBy.join("\n");
  }

  static createDeleteBy(entity) {
    const deleteBy = entity.deleteBy.map((DeleteByElement) => {
      let deleteByPart = serverRouter.deleteBy.replace(
        "@@URL@@",
        ConfigParser.urlName(DeleteByElement)
      );
      deleteByPart = deleteByPart.replace(
        "@@CONTROLLER_CLASS_NAME@@",
        ConfigParser.controllerName(entity)
      );
      deleteByPart = deleteByPart
        .split("@@CONTROLLER_METHOD_NAME@@")
        .join(ConfigParser.controllerMethodName(DeleteByElement, "deleteBy"));
      return deleteByPart;
    });
    return deleteBy.join("\n");
  }
}

module.exports = RouterCreator;
