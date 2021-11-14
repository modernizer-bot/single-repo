const selectByWithCount = `static async @@METHOT_NAME@@(@@ARGUMENT_OBJECT@@) {
    const data = await gres("@@SCHEMA@@@@ENTITY_NAME@@")
    .select(@@COLUMNS@@)
    .where(@@WHERE_ARRAY@@)
    .orderby({
      attr: sort,
      drt,
    })
    .limit(limit)
    .offset(offset)
    .run();

  const {count} = (await gres("@@SCHEMA@@@@ENTITY_NAME@@")
    .count()
    .where(@@WHERE_ARRAY@@)
    .run())[0];
    
  return { 
    data: {
      code: 1,
      message: "İşlem Başarılı",
      data_obj: {
        @@ENTITY_NAME@@: data,
        count
      }
    } 
  };
}
`;

module.exports = selectByWithCount;
