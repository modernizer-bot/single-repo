const { query } = require("./postgres");

/** @type {(idCol: string, nameCol: string, tableName: string, schema?: string) => Promise<{id: number, name: string}[]>} */
async function getPermissions(idCol,nameCol,tableName, schema = "public") {
  const res = await  query({
    text: `
    select ${idCol} as id, ${nameCol} as name from ${schema}.${tableName};
`,
    values: [],
  });
  return res.rows;
}
module.exports = {
  getPermissions,
};
