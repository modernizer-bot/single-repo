// const data = require("../../cop-config.json");
function validateEntities(data) {
  data.entities.forEach((entity, index) => {
    if (!(typeof entity.name === "string" && entity.name)) {
      throw new Error(`geco: entity.name must be exist, entity index ${index}`);
    }
    if (!(typeof entity.type === "string")) {
      throw new Error(`geco: entity.type must be exist, entity.name ${entity.name}`);
    }
    if (!(typeof entity.authentication === "boolean")) {
      throw new Error(`geco: entity.authentication must be boolean, entity.name is ${entity.name}`);
    }
    if (!(typeof entity.authorization === "boolean")) {
      throw new Error(`geco: entity.authorization must be boolean, entity.name is ${entity.name}`);
    }
    if (!(Array.isArray(entity.permission) && entity.permission.length > 0)) {
      throw new Error(
        `geco: entity.permission must be array and length must be greater than 0, entity.name is ${entity.name}`
      );
    }
    if (!(typeof entity.logger === "boolean")) {
      throw new Error(`geco: entity.logger must be boolean, entity.name is ${entity.name}`);
    }
    if (!(typeof entity.rest === "boolean")) {
      throw new Error(`geco: entity.rest must be boolean, entity.name is ${entity.name}`);
    }
    if (entity.type === "table") {
      if (!(typeof entity.insert === "boolean")) {
        throw new Error(`geco: entity.insert must be boolean, entity.name is ${entity.name}`);
      }
      if (!Array.isArray(entity.selectBy)) {
        throw new Error(`geco: entity.selectBy must be array, entity.name is ${entity.name}`);
      }
      if (!Array.isArray(entity.updateBy)) {
        throw new Error(`geco: entity.updateBy must be array, entity.name is ${entity.name}`);
      }
      if (!Array.isArray(entity.deleteBy)) {
        throw new Error(`geco: entity.deleteBy must be array, entity.name is ${entity.name}`);
      }
      if (entity.selectBy.length > 0) {
        entity.selectBy.forEach((e) => {
          if (e.split("##").length !== 4) {
            throw new Error(
              `geco: entity.selectby elemant complies this regex "*##*##*##*", entity.name is ${entity.name}`
            );
          }
        });
      }
    } else if (entity.type === "view") {
      if (entity.selectBy.length > 0) {
        entity.selectBy.forEach((e) => {
          if (e.split("##").length !== 4) {
            throw new Error(
              `geco: entity.selectby elemant complies this regex "*##*##*##*", entity.name is ${entity.name}`
            );
          }
        });
      }
    } else if (entity.type === "sp") {
      if (!(typeof entity.call === "boolean")) {
        throw new Error(`geco: entity.call must be boolean, entity.name is ${entity.name}`);
      }
      if (!Array.isArray(entity.parameters)) {
        throw new Error(`geco: entity.parameters must be array, entity.name is ${entity.name}`);
      }
    } else {
      throw new Error("entity type must be one of 'table', 'view' and 'sp'.");
    }
  });
}
module.exports = validateEntities;
