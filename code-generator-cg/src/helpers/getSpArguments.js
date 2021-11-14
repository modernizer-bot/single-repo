const { query } = require("./postgres");

/** @type {(spName: string, schema?: string) => Promise<any>} */
function getSpArguments(spName, schema = "public") {
  return query({
    text: `
SELECT
    pg_catalog.pg_get_function_identity_arguments(p.oid) AS arguments
FROM   pg_catalog.pg_proc p
JOIN   pg_catalog.pg_namespace n ON n.oid = p.pronamespace
WHERE  p.proname = $1 AND n.nspname = '$2'
`,
    values: [spName, schema],
  });
}
module.exports = {
  getSpArguments,
};
