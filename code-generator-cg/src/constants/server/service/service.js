const service = `@@SIGNATURE@@
const { gres } = require("@@RELATIVE_HELPER_PATH_FROM_SERVICE@@/gres");

@@EXECUTE@@
@@INSERT@@
@@SELECT_ALL@@
@@SELECT_BY@@
@@UPDATE_BY@@
@@DELETE_BY@@
`;
module.exports = { service };
