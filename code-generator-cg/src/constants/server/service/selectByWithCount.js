const selectByWithCount = `exports.@@SERVICE_FUNCTION_NAME@@ = async function @@SERVICE_FUNCTION_NAME@@({sort, drt, limit, offset, @@ARGUMENTS@@}) {
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

  const { count } = (await gres("@@ENTITY_NAME@@")
    .count()
    .where([@@WHERE@@])
    .run())[0];
    
  return { data, count };
}
`;

module.exports = { selectByWithCount };
