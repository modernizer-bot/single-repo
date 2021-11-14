const ConfigParser = require("../helpers/parser");
const clientService = require("../../constants/apis");

class ApiCreator {
  // eslint-disable-next-line no-unused-vars
  static async fileData(entity, _options) {
    let scaffold = clientService.service;
    let post = "";
    let getBy = "";
    let putBy = "";
    let deleteBy = "";
    scaffold = scaffold.split("@@SERVICE_CLASS_NAME@@").join(ConfigParser.serviceName(entity));

    if (entity.type === "sp") {
      post = ApiCreator.createExecute(entity);
    } else if (entity.type === "view") {
      getBy = ApiCreator.createGetBy(entity);
    } else if (entity.type === "table") {
      if (entity.insert) {
        post = ApiCreator.createPost(entity);
      }
      getBy = ApiCreator.createGetBy(entity);
      putBy = ApiCreator.createPutBy(entity);
      deleteBy = ApiCreator.createDeleteBy(entity);
    }
    scaffold = scaffold.replace("@@POST@@", post);
    scaffold = scaffold.replace("@@GET_BY@@", getBy);
    scaffold = scaffold.replace("@@PUT_BY@@", putBy);
    scaffold = scaffold.replace("@@DELETE_BY@@", deleteBy);
    return scaffold;
  }

  static createExecute(entity) {
    const execute = clientService.execute
      .split("@@ARGUMENT_NAMES@@")
      .join(ConfigParser.createArguments(entity.parameters));
    return execute.replace("@@BASE_URL@@", ConfigParser.baseUrlName(entity));
  }

  static createPost(viewObject) {
    return clientService.post.replace("@@BASE_URL@@", ConfigParser.baseUrlName(viewObject));
  }

  static createGetBy(entity) {
    const getBy = entity.selectBy.map((clause) => {
      const methodName = ConfigParser.serviceMethodName(clause, "getBy");
      let getByPart = clientService.getBy.replace("@@SERVICE_METHOD_NAME@@", methodName);
      const argumentStatement = ConfigParser.argumentStatement(clause);
      getByPart = getByPart.replace("@@ARGUMENTS@@", argumentStatement);
      const queryString = ConfigParser.queryString(clause);
      getByPart = getByPart.replace("@@QUERY_STRING@@", queryString);
      getByPart = getByPart.replace("@@BASE_URL@@", ConfigParser.baseUrlName(entity));
      getByPart = getByPart.replace("@@URL@@", ConfigParser.urlName(clause));
      return getByPart;
    });
    return getBy.join("\n");
  }

  static createPutBy(entity) {
    const putBy = entity.updateBy.map((clause) => {
      const methodName = ConfigParser.serviceMethodName(clause, "putBy");
      let updateByFragment = clientService.putBy.replace("@@SERVICE_METHOD_NAME@@", methodName);
      const argumentStatement = ConfigParser.argumentStatement(clause, false);
      updateByFragment = updateByFragment.replace("@@ARGUMENTS@@", argumentStatement);
      const queryString = ConfigParser.queryString(clause);
      updateByFragment = updateByFragment.replace("@@QUERY_STRING@@", queryString);
      updateByFragment = updateByFragment.replace("@@BASE_URL@@", ConfigParser.baseUrlName(entity));
      updateByFragment = updateByFragment.replace("@@URL@@", ConfigParser.urlName(clause));
      return updateByFragment;
    });

    return putBy.join("\n");
  }

  static createDeleteBy(entity) {
    const deleteBy = entity.deleteBy.map((clause) => {
      const methodName = ConfigParser.serviceMethodName(clause, "deleteBy");
      let deleteByFragment = clientService.deleteBy.replace("@@SERVICE_METHOD_NAME@@", methodName);
      const argumentStatement = ConfigParser.argumentStatement(clause, false);
      deleteByFragment = deleteByFragment.replace("@@ARGUMENTS@@", argumentStatement);
      const queryString = ConfigParser.queryString(clause);
      deleteByFragment = deleteByFragment.replace("@@QUERY_STRING@@", queryString);
      deleteByFragment = deleteByFragment.replace("@@BASE_URL@@", ConfigParser.baseUrlName(entity));
      deleteByFragment = deleteByFragment.replace("@@URL@@", ConfigParser.urlName(clause));
      return deleteByFragment;
    });

    return deleteBy.join("\n");
  }
}

module.exports = ApiCreator;
