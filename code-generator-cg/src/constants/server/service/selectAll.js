const selectAll = `exports.@@SERVICE_FUNCTION_NAME@@ = async function @@SERVICE_FUNCTION_NAME@@({sort, drt, limit, offset}) {
    const data = await gres("@@ENTITY_NAME@@")
    .select(["*"])
    .orderby({
      attr: sort,
      drt,
    })
    .limit(limit)
    .offset(offset)
    .run();

  const { count } = (await gres("@@ENTITY_NAME@@")
    .count()
    .run())[0];
    
  return { data, count };
}
`;

module.exports = { selectAll };
