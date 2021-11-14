/**
 * @typedef {import("../types/cgConfig").CgConfig} CgConfig
 * @typedef {import("../types/cgIConfig").CgIConfig} CgIConfig
 *
 */
const { getPermissions } = require("../helpers/getPermissions");

/** @type {(cgConfig:CgConfig) => Promise<string>} */
async function permissionParser(cgConfig) {
  const { idCol, nameCol, tableName, schema } = cgConfig.permissions;
  const permissions = await getPermissions(idCol, nameCol, tableName, schema);
  console.log({ permissions });
  return permissions.map(({ id, name }) => `${name}: ${id}`).join(",\n");
}

module.exports = { permissionParser };
