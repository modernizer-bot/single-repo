const execute = `exports.@@SERVICE_FUNCTION_NAME@@ = async function @@SERVICE_FUNCTION_NAME@@({@@ARGUMENTS@@}) {
  const data = await gres("@@ENTITY_NAME@@")
    .execute([@@PARAMETERS@@],@@CALL@@)
    .run();
  
    return { data };
  }

`;

module.exports = { execute };
