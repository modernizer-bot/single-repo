const selectByWithoutCount = `exports.@@SERVICE_FUNCTION_NAME@@ = async function @@SERVICE_FUNCTION_NAME@@({sort, drt, limit, offset, @@ARGUMENTS@@}) {
    const data = await gres("@@ENTITY_NAME@@")
    .select(["*"])
    .where([@@WHERE@@])
    .orderby({
      attr: sort,
      drt,
    })
    .limit(limit)
    .offset(offset)
    .run();

  return { data };
}
`;

module.exports = { selectByWithoutCount };
