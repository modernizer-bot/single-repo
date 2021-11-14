const insert = `exports.@@SERVICE_FUNCTION_NAME@@ = async function @@SERVICE_FUNCTION_NAME@@(entity = {}) {
  const data = await gres("@@ENTITY_NAME@@")
    .insert(entity)
    .returning()
    .run();
  
  return { data };
}
`;

module.exports = { insert };
