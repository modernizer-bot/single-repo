const deleteBy = `exports.@@SERVICE_FUNCTION_NAME@@ = async function @@SERVICE_FUNCTION_NAME@@({@@ARGUMENTS@@}) {
  const data = await gres("@@ENTITY_NAME@@")
    .delete()
    .where([@@WHERE@@])
    .returning()
    .run();

  return { data };
}
`;

module.exports = { deleteBy };
