const updateBy = `exports.@@SERVICE_FUNCTION_NAME@@ = async function @@SERVICE_FUNCTION_NAME@@({@@ARGUMENTS@@} , entity = {}) {
  const data = gres("@@ENTITY_NAME@@")
    .update(entity)
    .where([@@WHERE@@])
    .returning()
    .run();

  return { data };
}
`;

module.exports = { updateBy };
